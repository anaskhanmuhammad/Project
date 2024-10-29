import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import * as http from "http";
import { SerialPort } from "serialport";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createPool, Pool, RowDataPacket } from "mysql2/promise";

const app = express();
const server: HttpServer = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(bodyParser.json());

const pool: Pool = createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "ncgsa",
});

async function insertData(data: DataEntry) {
  console.log("Received data from serial port:", data);

  if (!isValidData(data)) {
    console.error("Invalid data received:", data);
    return;
  }

  const formattedDate = new Date(data.timestamp * 1000)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
  const sql = `INSERT INTO records (TIMESTAMP, x, y, z, total, temp) VALUES (?,?,?,?,?,?)`;
  try {
    const connection = await pool.getConnection();
    await connection.execute(sql, [
      data.timestamp,
      data.x,
      data.y,
      data.z,
      data.total,
      data.temp,
    ]);
    connection.release();
    console.log(`Inserted data: ${formattedDate}, ${data.timestamp}`);
  } catch (error) {
    console.error("Error inserting data:", error);
  }
}

// Data validation function
function isValidData(data: DataEntry): boolean {
  const isValidTimestamp =
    typeof data.timestamp === "number" &&
    data.timestamp.toString().length === 10 &&
    data.timestamp !== 0;

  return (
    isValidTimestamp &&
    typeof data.x === "number" &&
    data.x <= 9999999.9999997 &&
    typeof data.y === "number" &&
    data.y <= 9999999.9999997 &&
    typeof data.z === "number" &&
    data.z <= 9999999.9999997 &&
    typeof data.total === "number" &&
    data.total <= 9999999.9999997 &&
    typeof data.temp === "number" &&
    data.temp <= 9999999.9999997
  );
}

app.get("/fetchData", async (req, res) => {
  try {
    console.log("Calculating...");
    const data = await fetchAverageAndRMSValues();
    const formattedData = data.map((entry) => ({
      TIMESTAMP: entry.TIMESTAMP,
      avgX: parseFloat(entry.avgX).toFixed(2),
      avgY: parseFloat(entry.avgY).toFixed(2),
      avgZ: parseFloat(entry.avgZ).toFixed(2),
      avgTotal: parseFloat(entry.avgTotal).toFixed(2),
      rmsX: parseFloat(entry.rmsX).toFixed(2),
      rmsY: parseFloat(entry.rmsY).toFixed(2),
      rmsZ: parseFloat(entry.rmsZ).toFixed(2),
      rmsTotal: parseFloat(entry.rmsTotal).toFixed(2),
    }));
    res.json(formattedData);
  } catch (error) {
    console.error("Error handling fetch data request:", error);
    res.status(500).json({
      error: "An error occurred while handling fetch data request",
    });
  }
});

async function fetchAverageAndRMSValues(): Promise<any[]> {
  try {
    const connection = await pool.getConnection();
    const [rows]: [RowDataPacket[], any[]] = await connection.execute(`
      SELECT
         TIMESTAMP,
        AVG(X) AS avgX,
        AVG(Y) AS avgY,
        AVG(Z) AS avgZ,
        AVG(TOTAL) AS avgTotal,
        SQRT(AVG(X*X)) AS rmsX,
        SQRT(AVG(Y*Y)) AS rmsY,
        SQRT(AVG(Z*Z)) AS rmsZ,
        SQRT(AVG(TOTAL*TOTAL)) AS rmsTotal
      FROM
      (SELECT * FROM ncgsa.records ORDER BY TIMESTAMP DESC LIMIT 6000) AS last_600
      WHERE
        LENGTH(TIMESTAMP) = 10 AND TIMESTAMP != 0
      GROUP BY
        TIMESTAMP;
    `);
    console.log("Fetched rows:", rows);
    connection.release();
    return rows;
  } catch (error) {
    console.error("Error fetching average and RMS values:", error);
    throw error;
  }
}

async function initializeSerialPort() {
  const ports = await SerialPort.list();
  console.log(ports);

  const espPort = ports.find(
    (port) => port.manufacturer === "Silicon Laboratories"
  );

  if (!espPort) {
    console.error("Port not found.");
    return;
  }

  const portName = espPort.path;
  console.log("Port:", portName);
  const port = new SerialPort({ path: portName, baudRate: 115200 });

  port.on("error", (err) => {
    console.error("Error connecting to serial port:", err.message);
  });

  port.on("open", () => {
    console.log("Serial port connected successfully");
    let dataBuffer = "";
    port.on("data", (data: Buffer) => {
      const rawData = data.toString();
      dataBuffer += rawData;

      const lines = dataBuffer.split("\n");
      while (lines.length > 1) {
        const line = lines.shift();
        if (line) {
          if (line.includes(",")) {
            const parts = line.split(",");
            if (parts.length >= 6) {
              const [timestamp, x, y, z, total, temp] = parts.map(Number);
              console.log(`Timestamp: ${timestamp}`);
              console.log(
                `X: ${x}, Y: ${y}, Z: ${z}, Total: ${total}, Temp: ${temp}`
              );
              const dataEntry: DataEntry = {
                timestamp,
                x,
                y,
                z,
                total,
                temp,
              };
              insertData(dataEntry);

              io.emit("dataReceived", {
                timestamp,
                x,
                y,
                z,
                total,
                temp,
              });
            } else {
              console.log(`Incomplete data line: ${line}`);
            }
          } else {
            console.log(`Configuration line: ${line}`);
          }
        }
        dataBuffer = lines.join("\n");
      }
    });
  });
}

interface DataEntry {
  timestamp: number;
  x: number;
  y: number;
  z: number;
  total: number;
  temp: number;
}

initializeSerialPort();

app.get("/getPortName", async (req, res) => {
  try {
    const ports = await SerialPort.list();
    console.log("Available ports:", ports);

    const espPort = ports.find(
      (port) => port.manufacturer === "Silicon Laboratories"
    );

    if (!espPort) {
      console.error("Port not found.");
      return res.status(404).json({ error: "Port not found" });
    }

    const portName = espPort.path;
    console.log("Port name found:", portName);

    // Send the port name back to the client
    res.json({ portName });
  } catch (error) {
    console.error("Error fetching port name:", error);
    res.status(500).json({
      error: "An error occurred while fetching the port name",
    });
  }
});


const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

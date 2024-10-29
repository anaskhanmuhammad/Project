import React from "react";
import Button from "@mui/material/Button";
import { saveAs } from "file-saver"; // Import file-saver library

// import InputLabel from '@mui/material/InputLabel';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';

const Side = ({ data, handleButtonClick }) => {
  const lastData = data && data.length > 0 ? data[data.length - 1] : null;

  const handleExportData = () => {
    if (!data || data.length === 0) {
      alert("No graph data available to export.");
      return;
    }
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split("T")[0]; // Get current date in 'YYYY-MM-DD' format
    const fileName = `Magnetic field value${formattedDate}.csv`;
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, fileName);
  };

  const convertToCSV = (data) => {
    // Add a new column header for the date-time format
    const header = "DateTime," + Object.keys(data[0]).join(",") + "\n";

    // Convert each data entry to CSV format and add the date-time value
    const rows = data
      .map((entry) => {
        const timestamp = new Date(entry.TIMESTAMP * 1000); // Assuming TIMESTAMP is in seconds
        const formattedDateTime = `${
          timestamp.getMonth() + 1
        }/${timestamp.getDate()}/${timestamp.getFullYear()} ${timestamp.toLocaleTimeString()}`; // Custom date-time format
        return `${formattedDateTime},${Object.values(entry).join(",")}`;
      })
      .join("\n");

    return header + rows;
  };
  const connectSerialPort = () => {
    fetch("http://localhost:8080/connectSerialPort", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to connect to serial port");
        }
        console.log("Serial port connected successfully");
      })
      .catch((error) => {
        console.error("Error connecting to serial port:", error.message);
      });
  };

  return (
    <div className="w-1/4">
      <div>
        <fieldset className="border border-slate-600 p-5 m-2">
          <legend>Parameters Setting</legend>
          {/* <div className="mb-3">
            <div>
              <label htmlFor="duration" className="font-bold">
                Display duration
              </label>
            </div>
            <div>
              <input
                className="border border-slate-500 rounded-sm"
                type="number"
                name="duration"
                id="duration"
              />
            </div>
          </div> */}
          <div className="mb-3">
            <div>
              <label htmlFor="port" className="font-bold">
                serial port selection
              </label>
            </div>
            <div>
              {/* <label for="cars">Choose a car:</label> */}
              <select
                name="port"
                id="port"
                className="w-32 border border-slate-600 rounded-sm"
              >
                <option value="one">1</option>
                <option value="two">2</option>
                <option value="three">3</option>
                <option value="four">4</option>
              </select>
            </div>
          </div>
          <div className="mb-3">
            <div>
              <h4 className="font-bold">Measuring Mode</h4>
            </div>
            <div>
              <input type="radio" name="mode" id="mode" value={"absolute"} />
              <label htmlFor="mode">Absolute value measurement</label>
            </div>
            <div>
              <input type="radio" name="mode" id="mode" value={"relative"} />
              <label htmlFor="mode">Relative value measurement</label>
            </div>
          </div>
        </fieldset>
        <fieldset className="border border-slate-600 p-5 m-2">
          <legend>Magnetic Field Value</legend>
          <div className="mb-4">
            <label htmlFor="xValue" className="font-bold">
              X-axis:
            </label>
            <span className="border border-slate-500 rounded-sm mx-5 pr-24">
              {lastData ? lastData.avgX.toFixed(2) : "0.00"}
            </span>
            <span>nT</span>
          </div>
          <div className="mb-4">
            <label htmlFor="yValue" className="font-bold">
              Y-axis:
            </label>
            <span className="border border-slate-500 rounded-sm mx-5 pr-24">
            {lastData ? lastData.avgY.toFixed(2) : "0.00"} 
          </span>
            <span>nT</span>
          </div>
          <div className="mb-4">
            <label htmlFor="zValue" className="font-bold">
              Z-axis:
            </label>
            <span className="border border-slate-500 rounded-sm mx-5 pr-24">
            {lastData ? lastData.avgZ.toFixed(2) : "0.00"} 
          </span>
            <span>nT</span>
          </div>
          <div className="mb-4">
            <label htmlFor="xValue" className="font-bold">
              Total
            </label>
            <span className="border border-slate-500 rounded-sm mx-4 pr-24 ml-8">
            {lastData ? lastData.avgTotal.toFixed(2) : "0.00"} 
          </span>
            <span>nT</span>
          </div>
        </fieldset>
        {/* <fieldset className="border border-slate-600 p-5 m-2  ">
          <legend>Operations Instruction</legend>
          <div className="flex gap-4 mb-4">
            <div>
              <Button
                className="w-36"
                variant="contained"
                // onClick={connectSerialPort}
              >
                Connect
              </Button>
            </div>
            <div>
              <Button
                className="w-36"
                variant="contained"
                onClick={handleButtonClick}
              >
                Collect
              </Button>
            </div>
          </div>
          <div className="flex gap-4  mb-4">
            <div>
              <Button className="w-36" variant="contained">
                Reset Zoom
              </Button>
            </div>
            <div>
              <Button
                className="w-36"
                variant="contained"
                onClick={handleExportData}
              >
                Start saving
              </Button>
            </div>
          </div>
          <div className="flex gap-4  mb-4">
            <div>
              <Button className="w-36" variant="contained">
                Data Replay
              </Button>
            </div>
            <div>
              <Button className="w-36" variant="contained">
                Exit
              </Button>
            </div>
          </div>
        </fieldset> */}
      </div>
    </div>
  );
};

export default Side;

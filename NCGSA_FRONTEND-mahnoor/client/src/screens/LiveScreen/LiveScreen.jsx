import { useState, useEffect } from "react";
import LiveSide from "../../components/LiveSide";
import RealChartGrid from "../../components/RealChartGrid";
import Record from "../../components/Record";
import io from "socket.io-client";
const LiveScreen = () => {
  const [dataPoints, setDataPoints] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:8080");

    socket.on("dataReceived", (newData) => {
      setDataPoints((currentPoints) => {
        // Group existing data points by timestamp
        const groupedData = currentPoints.reduce((acc, point) => {
          const { timestamp } = point;
          if (!acc[timestamp]) {
            acc[timestamp] = [];
          }
          acc[timestamp].push(point);
          return acc;
        }, {});

        // Add the new data point to the appropriate group
        const { timestamp } = newData;
        if (!groupedData[timestamp]) {
          groupedData[timestamp] = [];
        }
        groupedData[timestamp].push(newData);

        // Calculate averages for each timestamp
        const averagedData = Object.keys(groupedData).map((timestamp) => {
          const points = groupedData[timestamp];
          const sum = points.reduce(
            (acc, point) => {
              acc.x += point.x;
              acc.y += point.y;
              acc.z += point.z;
              acc.total += point.total;
              return acc;
            },
            { x: 0, y: 0, z: 0, total: 0 }
          );
          const count = points.length;
          return {
            timestamp: Number(timestamp),
            x: sum.x / count,
            y: sum.y / count,
            z: sum.z / count,
            total: sum.total / count,
          };
        });

        // Limit the array to the last 1000 averaged data points
        if (averagedData.length > 30) {
          averagedData.shift();
        }

        return averagedData;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  console.log(dataPoints);
  return (
    <>
      <div className="flex">
        <div className="w-3/4 mx-3">
          <RealChartGrid data={dataPoints} />
          <Record/>
        </div>
        <LiveSide  data={dataPoints} />
      </div>
    </>
  );
};

export default LiveScreen;

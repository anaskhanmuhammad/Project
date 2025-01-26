import React from "react";
import ApexRealTime from "./ApexRealTime";

const RealChartGrid = ({ data }) => {

  // Extract timestamps and average values from the data
  const timestamps = data.map((entry) => entry.timestamp);
  const averageValues = data.map((entry) => entry.averageValue);

  return (
    <div className="flex justify-center gap-5">
      <div className="w-1/2 hidden">
        {data.length > 0 && (
          <ApexRealTime
            hoverTitle={"X-axis"}
            titleText={"X-axis Magnetic Field Waveform"}
            yTitle={"X-axis Magnetic Field/nT"}
            color={"#247BA0"}
            data={data.map((d) => ({
              x: new Date(d.timestamp * 1000), // Convert to milliseconds
              y: parseFloat(d.x).toFixed(2), // or d.x, d.y, d.z depending on which value you want to plot
            }))}
          />
        )}
      </div>
      <div className="w-1/2">
        <ApexRealTime
          hoverTitle={"X-axis"}
          titleText={"X-axis Magnetic Field Waveform"}
          yTitle={"X-axis Magnetic Field/nT"}
          color={"#247BA0"}
          data={data.map((d) => ({
            x: new Date(d.timestamp * 1000 + 5 * 60 * 60 * 1000), // Convert Unix timestamp (in seconds) to milliseconds and adjust for GMT+5 timezone (5 hours ahead of UTC)
            y: parseFloat(d.x).toFixed(2), // or d.x, d.y, d.z depending on which value you want to plot
          }))}
        />

        <ApexRealTime
          hoverTitle={"Z-axis"}
          titleText={"Z-axis Magnetic Field Waveform"}
          yTitle={"Z-axis Magnetic Field/nT"}
          color={"#FF1654"}
          data={data.map((d) => ({
            x: new Date(d.timestamp * 1000 + 5 * 60 * 60 * 1000), // Convert Unix timestamp (in seconds) to milliseconds and adjust for GMT+5 timezone (5 hours ahead of UTC)
            y: parseFloat(d.y).toFixed(2), // or d.x, d.y, d.z depending on which value you want to plot
          }))}
        />
      </div>
      <div className="w-1/2 hidden">
        {data.length > 0 && (
          <ApexRealTime
            hoverTitle={"X-axis"}
            titleText={"X-axis Magnetic Field Waveform"}
            yTitle={"X-axis Magnetic Field/nT"}
            color={"#247BA0"}
            data={data.map((d) => ({
              x: new Date(d.timestamp * 1000), // Convert to milliseconds
              y: parseFloat(d.x).toFixed(2), // or d.x, d.y, d.z depending on which value you want to plot
            }))}
          />
        )}
      </div>
      <div className="w-1/2">
        <ApexRealTime
          hoverTitle={"Y-axis"}
          titleText={"Y-axis Magnetic Field Waveform"}
          yTitle={"Y-axis Magnetic Field/nT"}
          color={"#199AFB"}
          data={data.map((d) => ({
            x: new Date(d.timestamp * 1000 + 5 * 60 * 60 * 1000), // Convert Unix timestamp (in seconds) to milliseconds and adjust for GMT+5 timezone (5 hours ahead of UTC)
            y: parseFloat(d.z).toFixed(2), // or d.x, d.y, d.z depending on which value you want to plot
          }))}
        />
        <div className="hidden">
          {" "}
          <ApexRealTime
            hoverTitle={"Total-axis"}
            titleText={"Total axis Magnetic Field Waveform"}
            yTitle={"Total axis Magnetic Field/nT"}
            color={"#064e9b"}
            data={data.map((d) => ({
              x: new Date(d.timestamp * 1000), // Convert to milliseconds
              y: parseFloat(d.total).toFixed(2), // or d.x, d.y, d.z depending on which value you want to plot
            }))}
          />
        </div>
        <ApexRealTime
          hoverTitle={"Total-axis"}
          titleText={"Total axis Magnetic Field Waveform"}
          yTitle={"Total axis Magnetic Field/nT"}
          color={"#064e9b"}
          data={data.map((d) => ({
            x: new Date(d.timestamp * 1000 + 5 * 60 * 60 * 1000), // Convert Unix timestamp (in seconds) to milliseconds and adjust for GMT+5 timezone (5 hours ahead of UTC)
            y: parseFloat(d.total).toFixed(2), // or d.x, d.y, d.z depending on which value you want to plot
          }))}
        />
      </div>
    </div>
  );
};

export default RealChartGrid;

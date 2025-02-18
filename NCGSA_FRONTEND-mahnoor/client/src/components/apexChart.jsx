import { colors } from "@mui/material";
import React, { useCallback, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = ({ titleText, yTitle, color, hoverTitle, data, showSeperateWindow, chartId}) => {
  
  const dataRef = useRef();
  dataRef.current = data;

  const handleClick = useCallback(() => {
    showSeperateWindow(titleText, yTitle, color, hoverTitle, dataRef.current); 
  }, [titleText, yTitle, color, hoverTitle, data, chartId]); 


  const series = [
    {
      name: hoverTitle,
      data: data,
    },
  ];

  const options = {
    chart: {
      id: {chartId},
      type: "area",
      stacked: false,
      height: 350,
      //   foreColor:'#f44336',
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "zoom",
      },
      events: {
        click: handleClick
      },
    },
    colors: [color, "#cc2d6f"],
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    title: {
      text: titleText,
      align: "left",
    },
    fill: {
      //   colors:['#f44336'],
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    yaxis: {
      labels: {
        formatter: function (val, index) {
          // // Check if the index is within the bounds of the dates array
          // if (index >= 0 && index < dates.length) {
          //   // Access the value at the current index of the dates array
          //   const value = dates[index][1];
          //   // Format and return the value for the y-axis label
          //   return value;
          // }
          // // If the index is out of bounds, return an empty string
          // return "";
          return val;
        },
      },
      title: {
        text: yTitle,
      },
    },
    xaxis: {
      type: "datetime",
      title: {
        text: "Time/s",
      },
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val.toFixed(2);
        },
      },
      x: {
        format: "dd MMM yyyy hh:mm:ss",
      },
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
          
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;

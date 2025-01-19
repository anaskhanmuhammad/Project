import { colors } from "@mui/material";
import React, { useCallback, useEffect, useRef } from "react";
import ReactApexChart from "react-apexcharts";

const ApexChart = ({ titleText, yTitle, color, hoverTitle, data, showSeperateWindow, chartId, downloadType}) => {
  
  console.log(data);
  const dataRef = useRef();
  dataRef.current = data;

  const handleClick = useCallback(() => {
    console.log(dataRef.current); 
    console.log(color);
    console.log(titleText);
    console.log(hoverTitle);
    console.log(yTitle);
    console.log(color);
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
  // const downloadRef = useRef()

  // useEffect(() => {
  //   const chartInstance = downloadRef.current;

  //   if (!chartInstance) {
  //     return;
  //   }


  //   if (downloadType === 'PNG') {
  //     // console.log(downloadRef.current);
  //     // console.log(chartInstance.exports);
  //     // chartInstance.chart.dataURI().then((uri)=>{
  //     //   console.log(uri)
  //     // });

  //     chartInstance.chart.exports.exportToPng();


  //   }
  //   else if (downloadType === 'CSV') {
  //     chartInstance.chart.exports.exportToCSV({
  //       series: chartInstance.chart.w.config.series,
  //   });
  //   }
  //   else if (downloadType === 'SVG') {
  //     chartInstance.chart.exports.exportToSVG();
  //   }
  // },[downloadType])



  // const 

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          // ref={downloadRef}
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

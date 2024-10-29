import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const XAXISRANGE = 1000;

const ApexRealTime = ({ data }) => {
  const [series, setSeries] = useState([{ data: [] }]);
  const [options, setOptions] = useState({
    chart: {
      id: "realtime",
      height: 350,
      type: "line",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    title: {
      text: "Dynamic Updating Chart",
      align: "left",
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: "datetime",
      // range: 60000, // 60 seconds window
      // tickAmount: 1, // Adjust for better visibility of the x-axis labels
    },
    // yaxis: {
    //   max: 20000, // Adjust as needed based on your data range
    // },
    legend: {
      show: false,
    },
  });
  // console.log(data);
  useEffect(() => {
    if (data.length === 0) return;

    // const formattedData = data.map(d => ({
    //   x: d.x, // Convert to milliseconds
    //   y: d.y // or d.x, d.y, d.z depending on which value you want to plot
    // }));

    setSeries([{ data: data.slice() }]);

    ApexCharts.exec("realtime", "updateSeries", [{ data: data }, true]);
  }, [data]);

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexRealTime;

import React, { useState, useEffect, useRef } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import ApexChart from "./apexChart"; // Assuming ApexChart component is being used to render charts

const ChartGrid = ({ data }) => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [filteredData, setFilteredData] = useState(data);

  // Handle Date Range Change
  const handleDateRangeChange = (newRange) => {
    console.log(newRange)
    setDateRange(newRange);
    filterDataByDateRange(newRange);
  };

  // Function to filter data based on the selected date range
  const filterDataByDateRange = (range) => {
    const { startDate, endDate } = range;
    if (startDate && endDate) {
      console.log(new Date(new Date(startDate).setHours(0, 0, 0, 0)).getTime())
      // console.log(new Date(new Date(startDate).setHours(0, 0, 0, 0)))
      console.log(new Date(new Date(endDate).setHours(23, 59, 59, 999)).getTime())
      // console.log(new Date(new Date(endDate).setHours(23, 59, 59, 999)))
      // console.log(data[0].TIMESTAMP * 1000)

      const filtered = data.filter(
        (entry) =>
          entry.TIMESTAMP * 1000 >= new Date(new Date(startDate).setHours(0, 0, 0, 0)).getTime() &&
          entry.TIMESTAMP * 1000 <= new Date(new Date(endDate).setHours(23, 59, 59, 999)).getTime()
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data); // Show all data if no range is selected
    }
  };

  // Reset the filtered data when the date range or data changes
  useEffect(() => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setFilteredData(data); // Show all data if no range selected
    } else {
      filterDataByDateRange(dateRange);
    }
  }, [dateRange, data]);


  // Show a pop up screen on clicking each chart
  const [focusMode, setFocusMode] = useState(false);
  const titleRef = useRef();
  const yTitleRef = useRef();
  const colorRef = useRef();
  const hoverTitleRef = useRef();
  const dataRef = useRef();
  const chartIdRef = useRef();
  
  const showSeperateWindow = (titleText, yTitle, color, hoverTitle, data, chartId) => {
    titleRef.current = titleText;
    yTitleRef.current = yTitle;
    colorRef.current = color;
    hoverTitleRef.current = hoverTitle;
    dataRef.current = data;
    chartIdRef.current = chartId;
    setFocusMode(!focusMode);

    console.log(dataRef.current);
  }

  const [downloadType, setDownloadType] = useState('')

  const handleDownload = (event) => {
    console.log(event.target.value);
    setDownloadType(event.target.value);
    event.target.value = ''
  }
  
  const [view, setView] = useState(2)

  const handleViewChange = (event) => {
    console.log(event.target.value);
    setView(Number(event.target.value));

  }

  return (
    <>

    {focusMode && ( 
      <div className="fixed z-50 w-4/5 bg-white top-[10%] left-[10%] border-black border flex content-center flex-col items-center h-4/5 shadow-2xl rounded-md">
        <div className="w-full  ">
            <button onClick={() => showSeperateWindow()} className="float-right  w-10 m-2 text-xl">X</button>
        </div>
        <div className="w-full h-full content-center">
          <ApexChart
              hoverTitle={hoverTitleRef.current}
              titleText={titleRef.current}
              yTitle={yTitleRef.current}
              color={colorRef.current}
              data={dataRef.current}
              chartId={chartIdRef.current}
            />
        </div>
      </div>
    )}

    <div className={`${focusMode ? 'blur' : ''}`}>
      {/* DatePicker Section */}
      <h1 className="font-semibold  pl-2 "> Select Data Duration</h1>
      <div className="mb-4 border border-inherit ">
        <Datepicker
          value={dateRange}
          onChange={handleDateRangeChange}
          showShortcuts={true} // Enable quick shortcuts
          displayFormat={"YYYY-MM-DD"} // Display format to match your format
          // startWeekOn="sun" // Customize start of the week
          useRange={true} // Dual datepicker for selecting start and end date
          separator={"~"} // Separator between start and end dates
          
        />
      </div>

      {/* Download button Section */}
      <div className="w-full flex justify-end mt-5 mb-10">
        <div>
          {/* <label htmlFor="downloadType">Select View:</label> */}
            <select name="chartView" id="viewSelector" defaultValue={''} onChange={(event) => handleViewChange(event)} className="float-right bg-gray-700 text-white p-1 ml-1 rounded-xl">
              <option value="" disabled>Select View</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="4">4</option>
            </select>
        </div>
        <div>
          {/* <label htmlFor="downloadType">Download All Charts:</label> */}
          <select name="downloadType" id="downloadType" defaultValue={''} onChange={(event) => handleDownload(event)} className="float-right bg-gray-700 text-white p-1 ml-1 rounded-xl">
            <option value="" disabled>Download All Charts:</option>
            <option value="PNG">Download in PNG</option>
            <option value="SVG">Download in SVG</option>
            <option value="CSV">Download in CSV</option>
          </select>
        </div>

      </div>


      {/* Chart Grid Section */}
      <div className={`flex justify-center flex-wrap`}>
        <div className={`${view === 1? 'w-full': view ===2 ? 'w-1/2': view === 4 ? 'w-1/4' : 'w-1/2'}`}>
          <ApexChart
            hoverTitle={"X-axis"}
            
            titleText={"X-axis Magnetic Field Waveform"}
            yTitle={"X-axis Magnetic Field/nT"}
            color={"#247BA0"}
            data={filteredData.map((entry) => [
              entry.TIMESTAMP * 1000,
              entry.avgX,
              
            ])}
            showSeperateWindow={showSeperateWindow}
            chartId={'Chart-1'}
            downloadType={downloadType}
          />
        </div>

        <div className={`${view === 1? 'w-full': view ===2 ? 'w-1/2': view === 4 ? 'w-1/4' : 'w-1/2'}`}>
          <ApexChart
            hoverTitle={"Z-axis"}
            titleText={"Z-axis Magnetic Field Waveform"}
            yTitle={"Z-axis Magnetic Field/nT"}
            color={"#FF1654"}
            data={filteredData.map((entry) => [
              entry.TIMESTAMP * 1000,
              entry.avgZ,
            ])}
            showSeperateWindow={showSeperateWindow}
            chartId={'Chart-2'}
            downloadType={downloadType}
          />
        </div>

        <div className={`${view === 1? 'w-full': view ===2 ? 'w-1/2': view === 4 ? 'w-1/4' : 'w-1/2'}`}>
          <ApexChart
            hoverTitle={"Y-axis"}
            titleText={"Y-axis Magnetic Field Waveform"}
            yTitle={"Y-axis Magnetic Field/nT"}
            color={"#199AFB"}
            data={filteredData.map((entry) => [
              entry.TIMESTAMP * 1000,
              entry.avgY,
            ])}
            showSeperateWindow={showSeperateWindow}
            chartId={'Chart-3'}
            downloadType={downloadType}
          />
        </div>

        <div className={`${view === 1? 'w-full': view ===2 ? 'w-1/2': view === 4 ? 'w-1/4' : 'w-1/2'}`}>
          <ApexChart
            hoverTitle={"Total-axis"}
            titleText={"Total axis Magnetic Field Waveform"}
            yTitle={"Total axis Magnetic Field/nT"}
            color={"#064e9b"}
            data={filteredData.map((entry) => [
              entry.TIMESTAMP * 1000,
              entry.avgTotal,
            ])}
            showSeperateWindow={showSeperateWindow}
            chartId={'Chart-4'}
            downloadType={downloadType}
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default ChartGrid;

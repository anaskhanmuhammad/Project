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
  
  const showSeperateWindow = (titleText, yTitle, color, hoverTitle, data) => {
    titleRef.current = titleText;
    yTitleRef.current = yTitle;
    colorRef.current = color;
    hoverTitleRef.current = hoverTitle;
    dataRef.current = data;
    setFocusMode(!focusMode);

    console.log(dataRef.current);
  }



  return (
    <>

    {focusMode && ( 
      <div className="fixed z-50 w-4/5 bg-white top-[10%] left-[10%] border-black border flex content-center flex-col items-center h-4/5 shadow-2xl rounded-lg">
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
            />
        </div>
      </div>
    )}

    {(<div className={`${focusMode ? 'blur' : ''}`}>
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

      {/* Chart Grid Section */}
      <div className="flex justify-center gap-5">
        <div className="w-1/2">
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
            
          />

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
          />
        </div>
        <div className="w-1/2">
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
          />

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
          />
        </div>
      </div>
    </div>)}
    </>
  );
};

export default ChartGrid;

import React, { useState, useEffect, useRef } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import ApexChart from "./apexChart"; // Assuming ApexChart component is being used to render charts
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ChartGrid = ({ data }) => {
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [filteredData, setFilteredData] = useState(data);

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    filterDataByDateRange(newRange);
  };

  const filterDataByDateRange = (range) => {
    const { startDate, endDate } = range;
    if (startDate && endDate) {
      const filtered = data.filter(
        (entry) =>
          entry.TIMESTAMP * 1000 >= new Date(new Date(startDate).setHours(0, 0, 0, 0)).getTime() &&
          entry.TIMESTAMP * 1000 <= new Date(new Date(endDate).setHours(23, 59, 59, 999)).getTime()
      );
      if (filtered.length === 0) {
        toast.error("No Data is in the specified range", {
          position: "bottom-right",
          autoClose: 5000,      
          hideProgressBar: false, 
          closeOnClick: true,   
          pauseOnHover: true,        
        });
        setDateRange({
          startDate: null,
          endDate: null,
        });
      }
      else {
        setFilteredData(filtered);

      }
    } else {
      setFilteredData(data); 
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


  // Show a seperate window on clicking each chart
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
  }

  const handleDownloadCSV = (event) => { 
    const formattedData = data.map(item => ({
      category: new Date(item.TIMESTAMP * 1000).toISOString().replace("T", " ").split(".")[0],
      "X-axis": item.avgX,
      "Y-axis": item.avgY,
      "Z-axis": item.avgZ,
      "Total-axis" : item.avgTotal
    }));
  
    const headers = ["category", "X-axis", "Y-axis", "Z-axis", "Total-axis"];
    const rows = formattedData.map(row => headers.map(header => row[header]).join(","));
    const csvContent = [headers.join(","), ...rows].join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
  
  const [view, setView] = useState(2)

  const handleViewChange = (event) => {
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

      <div className="w-full flex justify-end mt-5 mb-10">
        <div>
            <select name="chartView" id="viewSelector" defaultValue={''} onChange={(event) => handleViewChange(event)} className="float-right bg-gray-700 text-white p-1 ml-1 rounded-xl">
              <option value="" disabled>Select View</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="4">4</option>
            </select>
        </div>
        <div>
          <button onClick={() => handleDownloadCSV()} className="float-right bg-gray-700 text-white p-1 ml-1 rounded-xl">Download data in CSV</button>
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
          />
        </div>
      </div>
    </div>
    <ToastContainer/>
    </>
  );
};

export default ChartGrid;

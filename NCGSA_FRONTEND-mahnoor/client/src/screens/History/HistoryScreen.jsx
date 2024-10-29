import { useEffect, useState } from "react";
import Body from "../../components/Body";
import Side from "../../components/Side";
import Datepicker from "react-tailwindcss-datepicker";
const HistoryScreen = () => {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });
  console.log("hey Mahnoor");
  const [data, setData] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/fetchData");
        if (!response.ok) {
          throw new Error("Failed to fetch db data");
        }
        const fetchedData = await response.json();
        // Assuming responseData is the array containing the response data
        const formattedChartData = fetchedData.map((entry) => ({
          TIMESTAMP: entry.TIMESTAMP,
          avgX: parseFloat(entry.avgX),
          avgY: parseFloat(entry.avgY),
          avgZ: parseFloat(entry.avgZ),
          avgTotal: parseFloat(entry.avgTotal),
          rmsX: parseFloat(entry.rmsX),
          rmsY: parseFloat(entry.rmsY),
          rmsZ: parseFloat(entry.rmsZ),
          rmsTotal: parseFloat(entry.rmsTotal),
        }));
        const filteredData = fetchedData.filter((entry) => entry[0] !== 0);
        setData(formattedChartData);
        console.log("Formated data successfully:", formattedChartData);
        console.log("Data fetched successfully:", fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [buttonClicked]);

  const handleButtonClick = () => {
    setButtonClicked((prev) => !prev);
    console.log(buttonClicked);
  };
  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex">
     
      <Body data={data} />
      {/* <Side data={data} handleButtonClick={handleButtonClick} /> */}
    </div>
  );
};

export default HistoryScreen;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {Chart as ChartJS,LineElement,Filler,Legend,Tooltip,CategoryScale,LinearScale,PointElement,Title} from "chart.js";
ChartJS.register(LineElement, Filler, Legend, Tooltip, CategoryScale, LinearScale, PointElement, Title);
import '../styles/LineChart.css'
const moodMap = {
  "Happy": 4,
  "Neutral": 3,
  "Sad": 2,
  "Stressed": 1
};

function LineChart() {

  const getLastDayOfMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const [chartData, setChartData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("03");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedDay,setSelectedDay]=useState(15)
  const [showText,setShowText]=useState('..')

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const response = await axios.post("https://moodly-bhzh.onrender.com/api/getmoodentry", {selectedMonth,selectedYear,selectedDay},{ withCredentials: true });
        if(response.data.length>0)
        {
          console.log("Fetched Mood Data:", response.data);
          const formattedData = response.data.map(entry => ({
            date: entry.date.slice(0, 10),
            moodValue: moodMap[entry.moodValue] || 0 
          }));
          setChartData(formattedData)
        }
        else{
          setShowText("No Data Found For This Week")
        }
      } catch (error) {
        console.error("Error fetching mood data:", error);
      }
    };
    fetchMoodData();
  }, [selectedMonth,selectedYear,selectedDay]);

  useEffect(()=>{
    setTimeout(()=>{
      setShowText("..")
    },2000)
  },[showText])

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
  };
  const lastDayOfMonth = getLastDayOfMonth(selectedYear, selectedMonth);
  const startdate=new Date(selectedYear,selectedMonth-1,selectedDay)
  const enddate=new Date(selectedYear,selectedMonth-1,Math.min(selectedDay+6,lastDayOfMonth))
  const labels = chartData.map(entry => entry.date);
  const moodValues = chartData.map(entry => entry.moodValue);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Mood Trends",
        data: moodValues,
        backgroundColor: "rgba(0, 0, 255, 0.2)",
        borderColor: "rgba(0, 0, 255, 0.6)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          usePointStyle: true
        }
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const moodLabels = { 1: "Stressed", 2: "Sad", 3: "Neutral", 4: "Happy" };
            return `Mood: ${moodLabels[tooltipItem.raw] || "Unknown"}`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
          autoSkip: false,
          callback: function (value) {
            const moodLabels = { 1: "Stressed", 2: "Sad", 3: "Neutral", 4: "Happy" };
            return moodLabels[value] || ""
          }
        }
      }
    }
  };

  return (
    <div className="container-linechart">
      <p style={{color:showText!==".."?'red':'white'}} className='nodatatext'>{showText}</p>
      <div className="filter-container">
        <button onClick={() => setSelectedDay((prev) => Math.max(1, prev - 7))} disabled={selectedDay === 1} className="week-nav-buttons">Prev Week</button>
        <button onClick={() => setSelectedDay((prev) => Math.min(lastDayOfMonth, prev + 7))} disabled={selectedDay > lastDayOfMonth - 6} className="week-nav-buttons">Next Week</button>
        <label>Month:</label>
        <select value={selectedMonth} onChange={(e) => {setSelectedMonth(e.target.value);setSelectedDay(1)}}>
            <option value="01">January</option>
            <option value="02">February</option>
            <option value="03">March</option>
            <option value="04">April</option>
            <option value="05">May</option>
            <option value="06">June</option>
            <option value="07">July</option>
            <option value="08">August</option>
            <option value="09">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
        </select>

        <label>Year:</label>
        <input type="number" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} min="2000" max="2100"/>
      </div>
      <p className="date-range">
        <strong>Showing Data From:</strong> {formatDate(startdate)} - {formatDate(enddate)}
      </p>
      <div style={{height:'250px'}}>
        {chartData.length > 0 ? <Line options={options} data={data}/> : <p>Not Enough Entries...</p>}
      </div>
    </div>
  );
}

export default LineChart;

import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, BarElement, Filler, Legend, Tooltip, CategoryScale, LinearScale, Title } from 'chart.js';
import  '../styles/BarChart.css'
ChartJS.register(BarElement, Filler, Legend, Tooltip, CategoryScale, LinearScale, Title);

function BarChart() {

    const getLastDayOfMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
      };

    const moodmap = {
        "Happy": 4,
        "Neutral": 3,
        "Sad": 2,
        "Stressed": 1
    };

    const [chartData, setChartData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("03");
    const [selectedYear, setSelectedYear] = useState("2025");
    const [selectedDay,setSelectedDay]=useState(15)
    const [showText,setShowText]=useState("..")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post("https://moodly-bhzh.onrender.com/api/getmoodentry", {selectedMonth,selectedYear,selectedDay},{ withCredentials: true });
                if (response.data && response.data.length > 0) {
                    const formattedData = response.data.map((entry) => ({
                        date: entry.date.slice(0, 10),
                        moodValue: moodmap[entry.moodValue] || 0
                    }));
                    setChartData(formattedData);
                }
                else{
                    setShowText("No Data Found For This Week")
                }
            } catch (error) {
                console.error("Error fetching mood data:", error);
            }
        };
        fetchData();
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
    const labels = chartData.map((entry) => entry.date);
    const moodValues = chartData.map((entry) => entry.moodValue);
    const startDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
    const endDate = new Date(selectedYear, selectedMonth - 1, Math.min(selectedDay + 6, lastDayOfMonth));

    const data = {
        labels: labels,
        datasets: [
            {
                label: "Mood Score",
                data: moodValues,
                backgroundColor: moodValues.map(value => {
                    if (value === 4) return '#2ecc71'; // Green
                    if (value === 3) return '#f1c40f'; // Yellow
                    if (value === 2) return '#e67e22'; // Orange
                    if (value === 1) return '#e74c3c'; // Red
                }),
                borderColor: '#2c3e50',
                borderWidth: 1
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
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
                min:0,
                max:4,
                ticks: {
                    stepSize: 1,
                    callback: function (value) {
                        const moodLabels = { 1: "Stressed", 2: "Sad", 3: "Neutral", 4: "Happy" };
                        return moodLabels[value] || "";
                    },
                },
            },
        },
    };

    return (
        <div className="container-barchart">
            <p style={{color:showText!==".."?'red':'white'}} className='nodatatext'>{showText}</p>
            <div className="filter-container-barchart">
            <button onClick={() => setSelectedDay((prev) => Math.max(1, prev - 7))} disabled={selectedDay === 1} className='week-nav-buttons'>Prev Week</button>
            <button onClick={() => setSelectedDay((prev) => Math.min(lastDayOfMonth, prev + 7))} disabled={selectedDay > lastDayOfMonth - 6} className='week-nav-buttons'>Next Week</button>
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
                <input
                    type="number"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    min="2000"
                    max="2100"
                />
            </div>
            <p className="date-range">
                <strong>Showing Data From:</strong> {formatDate(startDate)} - {formatDate(endDate)}
            </p>
            <div style={{ height: "250px" }}>
                {chartData.length > 0 ? <Bar options={options} data={data} /> : <p>Not Enough Entries...</p>}
            </div>
        </div>
    );
}

export default BarChart;

import React,{useState,useEffect} from 'react';
import axios from 'axios';
import '../styles/PieChart.css'
import { Doughnut } from 'react-chartjs-2';
import {Chart as ChartJS,ArcElement,Filler,Legend,Tooltip,CategoryScale,LinearScale,PointElement,Title} from 'chart.js';
ChartJS.register(ArcElement,Filler,Legend,Tooltip,CategoryScale,LinearScale,PointElement,Title);

function PieChart(){

    const getLastDayOfMonth = (year, month) => {
        return new Date(year, month, 0).getDate();
      };

    const [chartData,setChartData]=useState([]);
    const [selectedMonth, setSelectedMonth] = useState("03");
    const [selectedYear, setSelectedYear] = useState("2025");
    const [selectedDay,setSelectedDay]=useState(15)
    const [showText,setShowText]=useState("..")

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.post("https://moodly-bhzh.onrender.com/api/getmoodentry",{ selectedMonth, selectedYear,selectedDay },{ withCredentials: true });
                if(response.data.length>0)
                {
                    const moodCounts = { Happy: 0, Neutral: 0, Sad: 0, Stressed: 0 };
                    response.data.forEach((entry) => {
                        moodCounts[entry.moodValue] += 1;
                    });
                    setChartData(moodCounts);
                }
                else{
                    setShowText("No Data Found For This Week")
                }
                
            } catch (error) {
                console.error("Error fetching mood data:", error);
            }
        };
        fetch();
    }, [selectedMonth, selectedYear,selectedDay]);

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

    const data={
        labels: ["Happy", "Neutral", "Sad", "Stressed"],
        datasets: [
            {
                data: [
                    chartData.Happy,
                    chartData.Neutral,
                    chartData.Sad,
                    chartData.Stressed
                ],
                backgroundColor: ['#2ecc71', '#f1c40f', '#e67e22', '#e74c3c'],
                borderColor: '#2c3e50',
                borderWidth: 1
            },
        ],
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: true,
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw} entries`;
                    }
                }
            }
        }
    };
    
    return(
        <div className="container-piechart">
            <p style={{color:showText!==".."?'red':'white'}}>{showText}</p>
            <div className="filter-container-piechart">
                <button onClick={() => setSelectedDay((prev) => Math.max(1, prev - 7))} disabled={selectedDay === 1} className='week-nav-buttons'>Prev Week</button>
                <button onClick={() => setSelectedDay((prev) => Math.min(lastDayOfMonth, prev + 7))} disabled={selectedDay>lastDayOfMonth-6} className='week-nav-buttons'>Next Week</button>
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
                <strong>Showing Data From:</strong> {formatDate(startdate)} - {formatDate(enddate)}
            </p>
            <div className='Doughnut-container'>
                {chartData? <Doughnut options={options} data={data}/> : <p>Not Enough Entries...</p>}
            </div>
        </div>
    )
}

export default PieChart;
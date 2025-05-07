import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import '../styles/AdminContent.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

function AdminContent() {
    const [monthlyUsers, setMonthlyUsers] = useState(0);
    const [weeklyUsers, setWeeklyUsers] = useState(0);
    const [chartData, setChartData] = useState({ labels: [], datasets: [] });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const monthlyResponse = await axios.get("https://moodly-bhzh.onrender.com/api/monthly-users", { withCredentials: true });
                const weeklyResponse = await axios.get("https://moodly-bhzh.onrender.com/api/weekly-users", { withCredentials: true });

                setMonthlyUsers(monthlyResponse.data.count);
                console.log(monthlyResponse.data.count,monthlyResponse.data.count)
                setWeeklyUsers(weeklyResponse.data.count);

                setChartData({
                    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
                    datasets: [
                        {
                            label: "Users",
                            data: weeklyResponse.data.weeklyCounts || [10, 15, 20, 25],
                            backgroundColor: "#007bff",
                        }
                    ],
                });
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="admin-container">
            <h1>Admin Dashboard 📊</h1>
            <div className="stats-container">
                <div className="stat-box">
                    <h2>{monthlyUsers}</h2>
                    <p>Total Monthly Users</p>
                </div>
                <div className="stat-box">
                    <h2>{weeklyUsers}</h2>
                    <p>Total Weekly Users</p>
                </div>
            </div>

            <div className="chart-container">
                <h2>Weekly User Growth</h2>
                <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} style={{height:'280px'}}/>
            </div>
        </div>
    );
}

export default AdminContent;

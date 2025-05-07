import React,{useEffect} from "react";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import PieChart from "./PieChart"
import "../styles/MoodAnalyticsPage.css";

function MoodAnalyticsPage() {
    useEffect(()=>{
        window.scrollTo(0,0)
    },[])
    return (
        <div className="mood-analytics-container">
            <h1>Mood Analytics 📊</h1>
            <p className="titilep">Track your mood patterns over time and gain insights into your emotional well-being.</p>

            <div className="charts-container">
                <div className="chart-card">
                    <h2>Monthly Mood Trends</h2>
                    <LineChart />
                </div>

                <div className="chart-card">
                    <h2>Overall Mood Distribution</h2>
                    <BarChart />
                </div>

                <div className="chart-card">
                    <h2>Monthly Mood Trends</h2>
                    <PieChart />
                </div>
            </div>
            <footer>
                <p>© 2025 Moodly. Take care of your mind. ❤️</p>
            </footer>
        </div>
    );
}

export default MoodAnalyticsPage;

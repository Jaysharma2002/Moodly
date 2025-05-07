import React from "react";
import '../styles/MoodAnalytics.css'
import LineChart from "./LineChart";
function MoodAnalytics() {
  return (
    <div className="card mood-analytics">
      <h2>Your Mood Trends</h2>
      <p>See how your mood has changed over time.</p>
      <div className="chart-placeholder">
        <LineChart/>
      </div>
    </div>
  );
}

export default MoodAnalytics;

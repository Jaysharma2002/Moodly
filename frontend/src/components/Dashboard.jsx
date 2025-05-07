import React from "react";
import MoodCheck from "./MoodCheck";
import MoodAnalytics from "./MoodAnalytics";
import SelfCare from "./SelfCare";
import "../styles/Dashboard.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <MoodCheck />
      <MoodAnalytics />
      <SelfCare />
    </div>
  );
}

export default Dashboard;

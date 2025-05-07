import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Userlogin from "./Userlogin";
import UserRegister from "./UserRegister";
import Header from "./Header";
import Content from "./Content";
import Journal from "./Journal";
import MoodAnalyticsPage from "./MoodAnalyticsPage";
import SelfCareGoals from "./SelfCareGoalsPage";
import UserProfile from "./UserProfile";
import LandingPage from './LandingPage'
import AI from "./AI";
import AdminLogin from "./AdminLogin";
import AdminHeader from "./AdminHeader";
import AdminContent from './AdminContent'
import AdminManage from "./AdminManage";
function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();

  return (
    <>
      {(location.pathname === "/content" || location.pathname === "/journal" || location.pathname==="/moodanalytics" || location.pathname==="/selfcaregoals" || location.pathname==="/userprofile" || location.pathname==="/ai") && <Header />}

      {(location.pathname === "/admincontent" || location.pathname==="/manageuser") && <AdminHeader />}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Userlogin />} />
        <Route path="/register" element={<UserRegister />} />
        <Route path="/content" element={<Content />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/moodanalytics" element={<MoodAnalyticsPage />} />
        <Route path="/selfcaregoals" element={<SelfCareGoals/>}/>
        <Route path="/userprofile" element={<UserProfile/>}/>
        <Route path="/ai" element={<AI/>}/>
        <Route path="/adminlogin" element={<AdminLogin/>}/>
        <Route path="/admincontent" element={<AdminContent/>}/>
        <Route path="/manageuser" element={<AdminManage/>}/>
      </Routes>
    </>
  );
}

export default App;

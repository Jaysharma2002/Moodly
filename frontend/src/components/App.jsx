import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Userlogin from "./components/Userlogin";
import UserRegister from "./components/UserRegister";
import Header from "./components/Header";
import Content from "./components/Content";
import Journal from "./components/Journal";
import MoodAnalyticsPage from "./components/MoodAnalyticsPage";
import SelfCareGoals from "./components/SelfCareGoalsPage";
import UserProfile from "./components/UserProfile";
import LandingPage from './components/LandingPage'
import AI from "./components/AI";
import AdminLogin from "./components/AdminLogin";
import AdminHeader from "./components/AdminHeader";
import AdminContent from './components/AdminContent'
import AdminManage from "./components/AdminManage";
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

import React from "react";
import { Link,useNavigate} from "react-router-dom";
import "../styles/LandingPage.css";
function LandingPage() {
  const navigate=useNavigate()
  return (
    <div className="landing-container">
      <header className="navbar">
        <img src="moodly.jpg" className="logo" onClick={()=>navigate("/adminlogin")}></img>
        <div className="auth-buttons">
          <Link to="/login" className="btn">Login</Link>
          <Link to="/register" className="btn signup">Sign Up</Link>
        </div>
      </header>

      <section className="herosection">
        <div className="herosection-text">
          <h2>Track Your Mood, Improve Your Mind ✨</h2>
          <p>
            Moodly helps you monitor your emotions, track mental well-being, and stay on top of self-care goals.
          </p>
          <Link to="/register" className="hero-btn">Get Started</Link>
        </div>
        <img src="mentalhealth.jpg" alt="Moodly App Preview" className="hero-image"/>
      </section>

      <section className="features">
        <h2>What You Can Expect</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <img src="journal.jpg" alt="Journal" />
            <h3>Daily Mood Journal</h3>
            <p>Record your thoughts and emotions to reflect on your mental well-being.</p>
          </div>
          <div className="feature-card">
            <img src="analytics.jpg" alt="Mood Analytics" />
            <h3>Mood Analytics</h3>
            <p>Track your emotional trends and gain insights over time.</p>
          </div>
          <div className="feature-card">
            <img src="goals.jpg" alt="Self-Care" />
            <h3>Self-Care Goals</h3>
            <p>Set and achieve personalized self-care goals for a balanced life.</p>
          </div>
        </div>
      </section>

      <footer>
        <p>© 2025 Moodly. Take care of your mind. ❤️</p>
      </footer>
    </div>
  );
}

export default LandingPage;

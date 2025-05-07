import React, { useState,useEffect} from "react";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import "../styles/Content.css";

function Content() {
  const images = [
    "scenery.jpg",
    "sunrise.jpg",
    "northern_lights.jpg"
  ];
  
  useEffect(()=>{
    window.scrollTo(0,0)
  },[])

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const interval = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearTimeout(interval);
  }, [currentIndex]);

  return (
    <div className="content-container">
      

      <div className="carousel-container">
        <button className="carousel-btn prev-btn" onClick={prevSlide}>❮</button>
        <div className="carousel-slide">
          <div className="hero" key={currentIndex}>
            <div className="hero-img">
              <img src={images[currentIndex]}></img>
            </div>
            <div className="hero-text">
            <h1>Welcome to Moodly 😊</h1>
              <p>Track your mental well-being and reflect on your thoughts daily.</p>
              <button className="journal-btn">
                <Link to="/journal">Write a Journal Entry ✍️</Link>
              </button>
            </div>
        </div>
        </div>
        <button className="carousel-btn next-btn" onClick={nextSlide}>❯</button>
      </div>

      <Dashboard />

      <footer>
        <p>© 2025 Moodly. Take care of your mind. ❤️</p>
      </footer>
    </div>
  );
}

export default Content;

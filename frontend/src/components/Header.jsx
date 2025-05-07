import React,{useState} from "react";
import { Link,useNavigate } from "react-router-dom";
import '../styles/Header.css'
function Header(){
    const navigate=useNavigate()
    const [profileExpand,setProfileExpand]=useState(false)
    return (
        <div className="Allheader">
            <img src="moodly.jpg" className="logo"></img>
            <div className="navlinks">
                <Link to="/content">Home</Link>
                <Link to="/journal">Journal</Link>
                <Link to="/moodanalytics">Mood Analytics</Link>
                <Link to="/selfcaregoals">Self-Care Goals</Link>
                <Link to="/ai">AI</Link>
                <div className="profile">
                    <button onClick={()=>setProfileExpand(!profileExpand)} className="profilebutton"><i className="fa-solid fa-bars"></i></button>
                    <div className={`profileexpand ${profileExpand?'visible':'hide'}`}>
                        <button onClick={()=>{navigate('/userprofile');setProfileExpand(false);}}><i className="fa-solid fa-user"></i></button>
                        <button onClick={()=>{navigate('/');setProfileExpand(false)}}><i className="fa-solid fa-right-from-bracket"></i></button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default Header
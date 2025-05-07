import React,{useState,useEffect} from "react";
import {useNavigate,Link} from 'react-router-dom'
import axios from 'axios'
import '../styles/Userlogin.css'
function Userlogin(){
    const navigate=useNavigate()
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [text,setText]=useState('')

    useEffect(()=>{
        if(text)
        {
            setTimeout(()=>{
                setText('')
            },3000)
        }
    },[text])

    const signin = async () => {
        try {
            if(email==="" || password==="")
            {
                setText('Fill the Input Fields First!!!')
            }
            else{
                const response = await axios.post("http://localhost:8000/api/login", {email,password,},{withCredentials:true});
            if (response.data.message === "Success") {
                navigate("/content");
            }
            else{
                setText(response.data.message)
            }
            }
            
        } catch (error) {
            setText("Invalid Credentials");
            console.error("Error from API:", error);
        }
    };
    return(
        <div className="outer-container">
        <div className="signup-container">
          <div className="left-section">
              <img src="sunset.jpg" className="left-section-img"></img>
              <div className="overlay">
                <img src="moodly.jpg" className="left-section-logo"></img>
              </div>
          </div>
    
          <div className="right-section">
            <button className="left-section-back-btn" onClick={()=>navigate('/')}>Go Back →</button>
            <h2 className="create-account">Login TO An Account</h2>
            <p className="login-text">Don't have an account? <Link to="/register">Sign Up</Link></p>
            <div className="input-group-login">
              <input type="email" placeholder="Email" className="input-field full-width" value={email} onChange={(e)=>setEmail(e.target.value)}/>
              <input type="password" placeholder="Enter your password" className="input-field full-width" value={password} onChange={(e)=>setPassword(e.target.value)}/>
              {text===""?(<span style={{color:'#2d2638'}}>...</span>):(<span style={{color:'red'}}>{text}</span>)}
              <button className="create-btn" onClick={()=>signin()}>Login</button>
            </div>
          </div>
        </div>
      </div>
    )
}

export default Userlogin
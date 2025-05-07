import React,{useState,useEffect} from "react";
import {useNavigate,Link} from 'react-router-dom'
import '../styles/Userlogin.css'
function AdminLogin(){
    const navigate=useNavigate()
    const [username,setUsername]=useState('')
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
            if(username ==="" || password === "")
            {
                setText('Fill the Input Fields First!!!')
            }
            else{
                if (username === "admin" && password === "admin") {
                    navigate("/admincontent");
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
            <h2 className="create-account">Login As Admin</h2>
            <div className="input-group">
              <input type="name" placeholder="Username" className="input-field full-width" value={username} onChange={(e)=>setUsername(e.target.value)}/>
              <input type="password" placeholder="Password" className="input-field full-width" value={password} onChange={(e)=>setPassword(e.target.value)}/>
              {text===""?(<span style={{color:'#2d2638'}}>...</span>):(<span style={{color:'red'}}>{text}</span>)}
              <button className="create-btn" onClick={()=>signin()}>Login</button>
            </div>
          </div>
        </div>
      </div>
    )
}

export default AdminLogin
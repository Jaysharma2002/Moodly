import React,{useState,useEffect} from "react";
import {useNavigate,Link} from 'react-router-dom'
import axios from "axios";
import '../styles/UserRegister.css'
function UserRegister(){
    const navigate=useNavigate()
    const [name,setName]=useState('')
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [text,setText]=useState('')

    useEffect(()=>{
        if(text)
        {
            setTimeout(()=>{
                setText()
            },3000)
        }
    },[text])

    const singup=async()=>{
        const response=await axios.post('http://localhost:8000/api/register',{name,email,password})
        if(response.data.message==="User Created")
        {
            navigate('/login')
        }
        setText(response.data.message)
        
    }

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
                <h2 className="create-account">Create an account</h2>
                <p className="login-text">Already have an account? <Link to="/login">Log in</Link></p>
                <div className="input-group">
                  <input type="text" placeholder="Name" className="input-field full-width" value={name} onChange={(e)=>setName(e.target.value)}/>
                  <input type="email" placeholder="Email" className="input-field full-width" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                  <input type="password" placeholder="Enter your password" className="input-field full-width" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                  <button className="create-btn" onClick={()=>singup()}>Create account</button>
                </div>
              </div>
            </div>
          </div>
    )
}

export default UserRegister
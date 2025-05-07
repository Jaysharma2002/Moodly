import React,{useState,useEffect} from "react";
import axios from "axios";
import '../styles/MoodCheck.css'
function MoodCheck() {
  const [moodValue,setMoodValue]=useState('')
  const [emptyValue,setEmptyValue]=useState(false)
  const [emptyMessage,setEmptyMessage]=useState('')

  useEffect(()=>{
    if(emptyValue)
    {
      setTimeout(()=>{setEmptyValue(false)},3000)
    }
    if(emptyMessage)
      {
        setTimeout(()=>{setEmptyMessage('')},3000)
      }
  },[emptyValue,emptyMessage])

  const saveMood = async () => {
    if (moodValue) {
      try {
        const response = await axios.post("http://localhost:8000/api/moodentry", { moodValue }, { withCredentials: true });
  
        console.log("Response Data:", response.data);
  
        if (response.data?.message==="Entry For This Date Already Exists") {
          setEmptyMessage(response.data.message);
          setEmptyValue(true)
        }
      } catch (error) {
        console.error("Error saving mood:", error);
        setEmptyMessage("Failed to save mood. Try again.");
        setEmptyValue(true)
      }
    } else {
      setEmptyValue(true);
    }
  };
  return (
    <div className="card mood-check">
      <h2>How are you feeling today?</h2>
      <div className="mood-icons">
        <button role="img" value="Happy" onClick={(e)=>setMoodValue(e.target.value)}>😊</button>
        <button role="img" value="Neutral" onClick={(e)=>setMoodValue(e.target.value)}>😐</button>
        <button role="img" value="Sad" onClick={(e)=>setMoodValue(e.target.value)}>😢</button>
        <button role="img" value="Stressed" onClick={(e)=>setMoodValue(e.target.value)}>😫</button>
      </div>
      <div className="lowerbutton">
        <button style={{color:emptyValue?'red':'white',backgroundColor:'white',border:'none'}}>{emptyMessage?emptyMessage:"Please Select Your Mood!!"}</button>
        <button className="save-btn" onClick={saveMood}>Save</button>
      </div>
    </div>
  );
}

export default MoodCheck;

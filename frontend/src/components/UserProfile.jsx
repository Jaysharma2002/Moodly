import React,{useState,useEffect} from "react";
import axios from "axios";
import '../styles/UserProfile.css'
function UserProfile()
{
    const [editData,setEditData]=useState({
        profileimage:'',
        name:'',
        email:'',
        gender:'',
        age:''
    })

    const [selectedImage,setSelectedImage]=useState(null)

    useEffect(()=>{
        const fetch=async()=>{
            const response=await axios.post("https://moodly-bhzh.onrender.com/api/userprofile",{},{withCredentials:true})
            console.log(response.data)
            setEditData({
                profileimage:response.data.profileimage || '',
                name:response.data.name || '',
                email:response.data.email || '',
                gender:response.data.gender || '',
                age:response.data.age || ''
            })
        }
        fetch()
        window.scrollTo(0,0)
    },[])

    function InputHandler(e){
        const {name,value}=e.target
        setEditData((prevState)=>({
            ...prevState,
            [name]:value,
        }))
    }

    function ImageHandler(e){
        setSelectedImage(e.target.files[0])
    }

    const submit=async()=>{
        try {
            const formdata=new FormData()
        if(selectedImage){
            formdata.append("profileimage",selectedImage)
        }
        formdata.append("name",editData.name)
        formdata.append("email",editData.email)
        formdata.append("gender",editData.gender)
        formdata.append("age",editData.age)
        const response=await axios.post("https://moodly-bhzh.onrender.com/api/updateprofile",formdata,{withCredentials:true,headers:{"Content-Type":"multipart/form-data"}})
        console.log(response.data)
        setEditData({
            profileimage:response.data.profileimage || '',
            name:response.data.name || '',
            email:response.data.email || '',
            gender:response.data.gender || '',
            age:response.data.age || ''
        })     
        } catch (error) {
            console.error("Profile update failed:", error);
        }
    }
    const deleteProfileImage = async () => {
        try {
            const response = await axios.post("https://moodly-bhzh.onrender.com/api/deleteprofileimage",{},{ withCredentials: true });
            console.log(response.data);
            setEditData((prev) => ({ ...prev, profileimage: "" }));
        } catch (error) {
            console.error("Failed to delete profile image:", error);
        }
    };
    return(
        <div className="Allcontainer">
        <div className="userprofile">
            <h1 className="headertitle">User Profile</h1>
            <div className="profile-img-container">
                <img
                    src={editData.profileimage ? `https://moodly-bhzh.onrender.com${editData.profileimage}` : "blank-profile.png"}
                    className="profileimage"
                    alt="Profile"
                />
                {editData.profileimage && (
                    <button className="delete-btn" onClick={deleteProfileImage}>{"x"}</button>
                )}
            </div>
            <div className="borderline">
                <label>Photo:</label>
                <input type="file" accept="image/*" onChange={ImageHandler}/>
            </div>
            <div className="borderline">
                <label>Name:</label>
                <input type="text" name="name" value={editData.name} onChange={InputHandler}/>
            </div>
            <div className="borderline">
                <label>Email:</label>
                <input type="text" name="email" value={editData.email} onChange={InputHandler}/>
            </div>
            <div className="borderline">
                <label>Gender:</label>
                <input type="text" name="gender" value={editData.gender} onChange={InputHandler}/>
            </div>
            <div className="borderline">
                <label>Age:</label>
                <input type="text" name="age" value={editData.age} onChange={InputHandler}/>
            </div>
            <button onClick={()=>submit()} className="savedetails">Submit</button>
        </div>
        </div>
    )
}

export default UserProfile
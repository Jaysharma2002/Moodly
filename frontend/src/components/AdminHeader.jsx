import { Link } from "react-router-dom";
import '../styles/Header.css'
function AdminHeader(){
    return (
        <div className="Allheader">
            <img src="moodly.jpg" className="logo"></img>
            <div className="navlinks">
                <Link to="/admincontent">Home</Link>
                <Link to='/manageuser'>Manage Users</Link>
                <Link to='/'><i className="fa-solid fa-right-from-bracket"></i></Link>
            </div>
        </div>
    )

}

export default AdminHeader
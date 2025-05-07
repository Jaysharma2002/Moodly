import React,{useState,useEffect} from "react";
import '../styles/SelfCare.css'
import axios from "axios";
function SelfCare() {
  const [goals, setGoals] = useState([]);

  const fetchGoals = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/getgoals", { withCredentials: true });
      setGoals(response.data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  useEffect(() => {
      fetchGoals();
    }, []);

  return (
    <div className="card self-care">
      <h2>Self-Care Goals ✨</h2>
      {goals.length > 0 ? (
        <ul>
          {goals.map((goal) => (
            <li key={goal._id} className={goal.completed ? "completed" : ""}>
              {goal.completed ? "✅" : "📌"} {goal.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>No self-care goals yet. Add some in the **Self-Care** section!</p>
      )}
    </div>
);
}

export default SelfCare;

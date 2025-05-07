import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SelfCareGoals.css";

function SelfCareGoals() {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

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

  const addGoal = async () => {
    if (!newGoal.trim()) return;
    try {
      await axios.post("http://localhost:8000/api/addgoal", { newGoal }, { withCredentials: true });
      setNewGoal("");
      fetchGoals();
    } catch (error) {
      console.error("Error adding goal:", error);
    }
  };

  const toggleCompletion = async (id, completed) => {
    try {
      await axios.put(`http://localhost:8000/api/updategoal/${id}`, { completed: !completed }, { withCredentials: true });
      fetchGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const deleteGoal = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/deletegoal/${id}`, { withCredentials: true });
      fetchGoals();
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="main-content">
        <div className="selfcare-container">
          <h2 className="selfcaretitle">Self-Care Goals ✨</h2>

          <ul className="goal-list">
            {goals.map((goal) => (
              <li key={goal._id} className={goal.completed ? "completed" : ""}>
                <span onClick={() => toggleCompletion(goal._id, goal.completed)}>
                  {goal.completed ? "✅" : "📌"} {goal.text}
                </span>
                <button className="delete-button" onClick={() => deleteGoal(goal._id)}>❌</button>
              </li>
            ))}
          </ul>

          <div className="add-goal">
            <input type="text" placeholder="Add a self-care goal..." value={newGoal} onChange={(e) => setNewGoal(e.target.value)} />
            <button onClick={addGoal}>➕ Add</button>
          </div>
        </div>
      </div>

      <footer>
        <p>© 2025 Moodly. Take care of your mind. ❤️</p>
      </footer>
    </div>
  );
}

export default SelfCareGoals;

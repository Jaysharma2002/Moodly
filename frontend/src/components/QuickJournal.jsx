import React from "react";
import '../styles/QuickJournal.css'
function QuickJournal() {
  return (
    <div className="card quick-journal">
      <h2>Write a Quick Thought</h2>
      <textarea placeholder="Write something..."></textarea>
      <button className="save-btn">Save</button>
    </div>
  );
}

export default QuickJournal;

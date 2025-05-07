import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Journal.css";

function Journal() {
    const [journalEntry, setJournalEntry] = useState([]);
    const [text, setText] = useState("");
    const [date, setDate] = useState("");
    const [expandedId, setExpandedId] = useState(null); 
    const [firstSliceArg,setFirstSliceArg]=useState(0);
    const [secondSliceArg,setSecondSliceArg]=useState(5);
    const [editId,setEditId]=useState(null)
    const [editText,setEditText]=useState('')

    const fetchEntries = async () => {
        try {
            const res = await axios.get("https://moodly-bhzh.onrender.com/api/getjournalentry", { withCredentials: true });
            setJournalEntry(res.data);
        } catch (error) {
            console.error("Error fetching journal entries:", error);
        }
    };

    useEffect(() => {
        window.scrollTo(0,0)
        fetchEntries();
    }, []);

    const saveEntry = async () => {
        try {
            await axios.post("https://moodly-bhzh.onrender.com/api/journalentry", { text, date }, { withCredentials: true });
            setText("");  
            setDate("");
            fetchEntries();
        } catch (error) {
            console.error("Error saving journal entry:", error);
        }
    };
    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const inputEdit=(entry)=>{
        setEditId(entry._id)
        setEditText(entry.text)
    }

    const saveEdit=async()=>{
        try {
            if(editId && editText)
            {
                await axios.put("https://moodly-bhzh.onrender.com/api/editjournalentry",{editId,editText},{withCredentials:true})
                setEditId(null)
                fetchEntries()
            }
            console.log(editId,editText)
        } catch (error) {
            console.error("Error editing journal entry:", error);
        }
        
    }

    const deleteEntry=async(id)=>{
        try {
            await axios.delete(`https://moodly-bhzh.onrender.com/api/deletejournalentry/${id}`,{withCredentials:true})
            fetchEntries()
        } catch (error) {
            console.error("Error deleting journal entry:", error);
        }
    }

    const canloadmore=secondSliceArg<journalEntry.length
    const cangoback=firstSliceArg>0
    return (
        <div className="journal-container">
            <h1>My Journal 📖</h1>

            <div className="journal-input">
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)}
                />
                <textarea
                    placeholder="Write your thoughts here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <button onClick={saveEntry}>Save Entry</button>
            </div>

            <div className="journal-display">
                <h2>Past Entries</h2>
                {journalEntry.length === 0 ? (
                    <p>No journal entries found.</p>
                ) : (
                    journalEntry.map((entry) => (
                        <div key={entry._id} className={`journal-entry ${expandedId === entry._id ? "expanded" : ""}`} onClick={() => toggleExpand(entry._id)}>

                            <p className="entry-date">{entry.date.slice(0, 10)}</p>

                            {editId===entry._id?(<textarea value={editText} onChange={(e)=>setEditText(e.target.value)}></textarea>)
                            :(<p className="entry-text">
                                {expandedId === entry._id ? entry.context : entry.context.substring(0, 50) + "..."}
                            </p>)}
                            
                            <div className="action-btns">
                                <button onClick={()=>saveEdit()} className="editsave-btn">Save</button>
                                <button onClick={()=>inputEdit(entry)} className="edit-btn">Edit</button>
                                <button onClick={()=>deleteEntry(entry._id)} className="editdelete-btn">Delete</button>
                            </div>
                        </div>
                        
                    )).slice(firstSliceArg,secondSliceArg)
                )}
                <div className="nextandprev">
                    <button onClick={()=>{setFirstSliceArg(firstSliceArg-5);setSecondSliceArg(secondSliceArg-5);}} disabled={!cangoback}>Prev</button>
                    <button onClick={()=>{setFirstSliceArg(firstSliceArg+5);setSecondSliceArg(secondSliceArg+5);}} disabled={!canloadmore}>Next</button>
                </div>
            </div>
            <footer>
                <p>© 2025 Moodly. Take care of your mind. ❤️</p>
            </footer>
        </div>
    );
}

export default Journal;

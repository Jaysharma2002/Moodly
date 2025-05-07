import React,{useState,useEffect} from "react";
import axios from "axios";
import '../styles/chatbot.css'
function AI(){

    const [data,setData]=useState('')
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [selectedMonth,setSelectedMonth]=useState("")
    const [selectedYear,setSelectedYear]=useState("2025")    

    const generate_summary=async()=>{
        try {
            const response = await axios.post("http://localhost:8000/api/aisummary", {selectedMonth,selectedYear}, { withCredentials: true });
            setData(response.data);
        } catch (error) {
            console.error("Error fetching AI summary:", error);
        }
    }

    const sendMessage = async () => {
        if (!input.trim()) return;
        
        const newMessages = [...messages, { text: input, sender: "user" }];
        setMessages(newMessages);
        setInput("");

        try {
            const response = await axios.post("http://localhost:8000/api/chatbot", { message: input });
            const botReply = response.data;

            setMessages([...newMessages, { text: botReply, sender: "bot" }]);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(()=>{
        console.log(data)
    },[data])

    return (
        <div className="AI-container" style={{paddingTop:'150px'}}>
            <div className="Summary-Genrator">
                <div className="filter-container-piechart">
                    <label>Month:</label>
                    <select value={selectedMonth} onChange={(e) => {setSelectedMonth(e.target.value)}}>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                    </select>

                    <label>Year:</label>
                    <input
                        type="number"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        min="2000"
                        max="2100"
                    />
                </div>
                <button onClick={()=>generate_summary()}>Generate Summary & Provide Advice</button>
                {data && (
                    <div className="summary-container">
                        <h3>📝 Monthly Mood Summary</h3>
                        <p className="summary-text"><strong>Summary:</strong> {data.summary}</p>

                        <h4>📌 Suggested Actions</h4>
                        <ul className="advice-list">
                        {data.advice.map((tip, index) => (
                            <li key={index}>✅ {tip}</li>
                        ))}
                        </ul>
                    </div>
                    )}
                </div>
                <div className="chatbot-container">
                <div className="chat-window">
                    {messages.length===0 && (<p className="emptychattitle"><i>"What’s one good thing that happened today, no matter how small?"</i></p>)}
                    {messages.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <div className="chat-input">
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }}>
                        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Talk to Moodly..." />
                        <button type="submit">Send</button>
                    </form>
                </div>
            </div>
        </div>
    )

}

export default AI
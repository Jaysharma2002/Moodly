import { User,Journal,Mood,Goal} from "./schema.js";
import fs from "fs"
import path from "path"
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const register=async(req,res)=>{
    try {
        const {name,email,password}=req.body
        const user=await User.findOne({email})
        if(user){
            return res.status(200).json({message:"User Already Exists"})
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newuser=await User.create({
            profileimage:'',
            name:name,
            email:email,
            password:hashedPassword,
            gender:'',
            age:'',
            createdAt:Date.now()
        })
        if(newuser){
            return res.json({message:'User Created'})
        }
        return res.json({message:'Try Agin Later'})
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
    
}

export const login=async(req,res)=>{
    try {
        const {email,password}=req.body
        const user=await User.findOne({email})
        if(!user){
            return res.status(200).json({message:"Email is not registered"})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid)
        {
            return res.status(200).json({message:"Incorrect Password"})
        }
        req.session.userId=user._id
        await req.session.save()
        return res.json({message:'Success'})
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
    
}

export const journalentry=async(req,res)=>{
    try {
        const userId=req.session.userId
        const {text,date}=req.body
        const DateFilled=await Journal.findOne({userId,date})
        if(DateFilled)
        {
            return res.status(404).json({message:"Entry Already Exits For This Date"})
        }
        const newentry=await Journal({
            userId:userId,
            date:date,
            context:text
        })
        await newentry.save()
        return res.status(201).json({ message: "Journal entry saved successfully" });
        
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const getjournalentry=async(req,res)=>{
    try {
        const userId=req.session.userId
        if(!userId)
        {
            return res.status(404).json({message:"No User Found"})
        }
        const journalentry=await Journal.find({userId})
        return res.json(journalentry)
        
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const editjournalentry=async(req,res)=>{
    try {
        const {editId,editText}=req.body
        const updatedEntry=await Journal.findByIdAndUpdate(editId,{context:editText},{new:true})
        if (!updatedEntry) {
            return res.status(404).json({ message: "Entry not found" });
        }
        return res.json(updatedEntry);
    } 
    catch (error) {
        return res.status(404).json({error:"Internal Server Error"}) 
    }
}

export const deletejournalentry=async(req,res)=>{
    try {
        const {id}=req.params
        const deletedEntry=await Journal.findByIdAndDelete(id)
        if (!deletedEntry) {
            return res.status(404).json({ message: "Entry not found" });
        }
        return res.status(200).json({ message: "Entry Deleted Successfully" });
    } 
    catch (error) {
        return res.status(404).json({error:"Internal Server Error"}) 
    }
}

export const moodentry = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { moodValue } = req.body;

        if (!userId || !moodValue) {
            return res.status(400).json({ message: "UserId or MoodValue is missing" });
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

        const moodExist = await Mood.findOne({userId,date: {$gte: today,$lt: tomorrow}});
        

        if (moodExist) {
            return res.status(200).json({ message: "Entry For This Date Already Exists" });
        }

        const mood = await Mood.create({
            userId,
            date:today,
            moodValue
        });

        return res.status(201).json({ message: "Mood saved successfully", mood });
    } 
    catch (error) {
        console.error("Error saving mood:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getmoodentry = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { selectedMonth, selectedYear ,selectedDay} = req.body;

        if (!selectedMonth || !selectedYear || !selectedDay) {
            return res.status(400).json({ message: "Month and Year and Week are required" });
        }

        const monthNumber = parseInt(selectedMonth, 10);

        const startDate = new Date(selectedYear, monthNumber - 1, selectedDay);
        const lastDayOfMonth = new Date(selectedYear, monthNumber, 0).getDate();
        const endDay = Math.min(selectedDay + 6, lastDayOfMonth);
        const endDate = new Date(selectedYear, monthNumber - 1, endDay + 1);

        const moodfetch = await Mood.find({
            userId,
            date: { $gte: startDate, $lt: endDate }}).sort({ date: 1 });

        return res.json(moodfetch);
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const addgoal=async(req,res)=>{
    try {
        const userId=req.session.userId
        const {newGoal}=req.body
        if(!userId || !newGoal)
        {
            return res.status(404).json({message:"UserId and Goal is required"})
        }
        const goalExists=await Goal.findOne({userId,text:newGoal})
        if(goalExists)
        {
            return res.status(404).json({message:"Goal Already Exist"})
        }
        const goalCreate=await Goal.create({
            userId:userId,
            text:newGoal,
            completed:false
        })
        if(goalCreate)
        {
            return res.status(200).json({message:"Goal Created Successfully"})
        }
        return res.status(404).json({message:"Error creating Goal"}) 
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export const getgoals=async(req,res)=>{
    try {
        const userId=req.session.userId
        if(!userId)
        {
            return res.status(404).json({message:"User Not Found"})
        }
        const goals=await Goal.find()
        if(goals)
        {
            return res.json(goals)
        }
        return res.status(404).json({message:"No Goals Found"})
    } catch (error) {
        return res.status(500).json({ error: "Internal Server Error" });
        
    }
}

export const deletegoal=async(req,res)=>{
    try {
        const {id}=req.params
        const deletedEntry=await Goal.findByIdAndDelete(id)
        if (!deletedEntry) {
            return res.status(404).json({ message: "Entry not found" });
        }
        return res.status(200).json({ message: "Entry Deleted Successfully" });
    } 
    catch (error) {
        return res.status(404).json({error:"Internal Server Error"}) 
    }
}

export const updategoal = async (req, res) => {
    try {
        const { id } = req.params;
        const { completed } = req.body;
        const updatedGoal = await Goal.findByIdAndUpdate(id, { completed }, { new: true });
        if (!updatedGoal){
            return res.status(404).json({ message: "Goal not found" });
        } 
        res.status(200).json(updatedGoal);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const userprofile=async(req,res)=>{
    try {
        const userId=req.session.userId
        console.log(userId)
        const user=await User.findById(userId)
        if(!user)
        {
            return res.status(404).json({message:"No User Found"})
        }
        return res.json(user)
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}
export const updateprofile=async(req,res)=>{
    try {
        const userId=req.session.userId
        console.log(userId)
        const updateData={...req.body}
        if(req.file)
        {
            updateData.profileimage = `/uploads/${req.file.filename}`;
        }
        const user=await User.findByIdAndUpdate(userId,updateData,{new:true})
        if(!user)
            {
                return res.status(404).json({message:"No User Found"})
            }
        return res.json(user)
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}
export const profileimage=async(req,res)=>{
    try {
        const userId=req.session.userId
        const user=await User.findById(userId)
        if(!user){
            return res.status(404).json({message:"No User Found"})
        }
        const profileimageurl=user.profileimage
        return res.json(profileimageurl)
        
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const deleteprofileimage=async(req,res)=>{
    try {
        const userId=req.session.userId
        const user=await User.findById(userId)
        if(!user)
        {
            return res.status(404).json({message:"No User Found"})
        }
        if (!user.profileimage) {
            return res.status(400).json({ message: "No profile image found to delete" });
        }
        const filename = path.basename(user.profileimage);
        const imagePath = path.join("uploads", filename);
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Error deleting image:", err);
                return res.status(500).json({ error: "Failed to delete image" });
            }
        });
        user.profileimage = "";
        await user.save();
        return res.json({ message: "Profile image deleted successfully" });
    } catch (error) {
        return res.status(404).json({error:"Internal Server Error"})
    }
}

export const aisummary = async (req, res) => {
    try {
        const userId = req.session.userId;
        const { selectedMonth, selectedYear } = req.body;

        if (!userId || !selectedMonth || !selectedYear) {
            return res.status(400).json({ message: "UserID, Selected Month, and Selected Year are required" });
        }

        const monthNumber = parseInt(selectedMonth, 10);
        const startdate = new Date(selectedYear, monthNumber - 1, 1);
        const enddate = new Date(selectedYear, monthNumber, 1);

        const moodEntries = await Mood.find({
            userId,
            date: { $gte: startdate, $lt: enddate }
        }).sort({ date: 1 });

        if (!moodEntries.length) {
            return res.status(404).json({ message: "No mood entries found for the selected period" });
        }

        const userMoods = moodEntries.map(entry => `${entry.date.toISOString().split("T")[0]}: ${entry.moodValue}`).join("\n");

        const promptText = `Analyze the user's mood trends for ${selectedMonth}/${selectedYear} based on the following data:\n\n${userMoods}\n\nReturn a structured JSON response with the following format:\n\n{
            "summary": "A brief 3-4 sentence summary of their mood trends.",
            "advice": ["Short, practical tip 1", "Short, practical tip 2", "Short, practical tip 3"]
        }`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const response = await model.generateContent(promptText);

        let aiResponseText = response.response?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!aiResponseText) {
            return res.status(500).json({ error: "Failed to generate AI summary" });
        }

        aiResponseText = aiResponseText.replace(/```json|```/g, "").trim();

        let aiSummary;
        try {
            aiSummary = JSON.parse(aiResponseText);
        } catch (parseError) {
            console.error("Error parsing AI response:", parseError);
            return res.status(500).json({ error: "AI response format error" });
        }

        return res.json(aiSummary);

    } catch (error) {
        console.error("AI Summary Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const chatbotResponse = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `Act as a **compassionate, supportive, and professional mental health therapist**.  
        Your goal is to provide **short, kind, and practical** responses to help users manage their emotions and mental well-being.  

        ### **Guidelines:**  
        1. **Strictly Respond to Mental Health & Well-being Topics Only**  
        - If the user asks about anything **unrelated to mental health (e.g., programming, politics, trivia, general knowledge, etc.), politely redirect them**.  
        - Example:  
            - **User:** "Tell me a joke."  
            - **You:** "I'm here to support your mental well-being. Would you like to talk about how you're feeling?"  

        2. **Be Empathetic & Encouraging** – Acknowledge emotions before offering guidance.  
        3. **Keep Responses Short & Helpful** – Limit replies to 2-3 sentences.  
        4. **Encourage Self-Reflection** – Ask gentle follow-up questions when relevant.  
        5. **Avoid Diagnosing or Medical Advice** – Instead, provide general well-being tips.  
        6. **Redirect Crisis Situations** – If a user expresses harm-related thoughts, **gently encourage them to seek professional help**.  

        ### **User Message Example & Your Response:**  
        - **User:** *"I'm feeling really anxious today."*  
        - **You:** *"I'm sorry you're feeling this way. Would you like to talk about what’s on your mind? Deep breathing or a short walk might help."*  

        - **User:** *"I feel unmotivated and stuck."*  
        - **You:** *"That sounds tough. Try breaking tasks into small steps and celebrating little wins. What’s one thing you can do right now?"*  

        - **User:** *"Tell me about the latest technology trends."*  
        - **You:** *"I focus on mental well-being. If you're feeling stressed about technology or work, I’d be happy to suggest ways to relax."*  

        - **User:** *"How do I invest in stocks?"*  
        - **You:** *"I'm here to help with mental well-being. If financial stress is affecting you, I can share some relaxation techniques."*  

        - **User:** *"I don’t think I can handle things anymore."*  
        - **You:** *"I'm really sorry you're feeling this way. You don’t have to go through this alone—please consider reaching out to someone you trust or a professional."*  

        Keep all responses **non-judgmental, warm, and encouraging**.  
        If a user **asks something unrelated**, **gently redirect them** back to discussing their emotional well-being.  

        Here’s the user’s message: "${message}"`;

        const response = await model.generateContent(prompt);

        const reply = response.response.text();
        console.log(reply)

        return res.json(reply);
    } catch (error) {
        console.error("Error in chatbot response:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get total users for the current month
export const getMonthlyUsers = async (req, res) => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the month
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of the month

        const monthlyUsers = await User.countDocuments({
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });
        res.json({ count: monthlyUsers });
    } catch (error) {
        console.error("Error fetching monthly users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get total users for the current week
export const getWeeklyUsers = async (req, res) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Get last Sunday
        startOfWeek.setHours(0, 0, 0, 0);

        const weeklyUsers = await User.countDocuments({
            createdAt: { $gte: startOfWeek }
        });
        res.json({ count: weeklyUsers });
    } catch (error) {
        console.error("Error fetching weekly users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get weekly user growth (Bar Chart Data)
export const getWeeklyUserGrowth = async (req, res) => {
    try {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Get last Sunday
        startOfWeek.setHours(0, 0, 0, 0);

        const weeklyUserCounts = await User.aggregate([
            { 
                $match: { createdAt: { $gte: startOfWeek } } 
            },
            { 
                $group: { 
                    _id: { $dayOfWeek: "$createdAt" }, 
                    count: { $sum: 1 } 
                } 
            },
            { 
                $sort: { "_id": 1 } 
            }
        ]);

        const formattedData = Array(7).fill(0);
        weeklyUserCounts.forEach(day => {
            formattedData[day._id - 1] = day.count; // Adjusting MongoDB's day (1 = Sunday)
        });
        res.json({ weeklyCounts: formattedData });
    } catch (error) {
        console.error("Error fetching weekly user growth:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUsers=async (req, res) => {
    const users = await User.find();
    res.json(users);
  };

export const updatedUser =async (req, res) => {
    const { name, email } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
    res.json(updatedUser);
};

export const deleteUser=async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  };
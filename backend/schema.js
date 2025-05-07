import mongoose from "mongoose";

const UserSchema=mongoose.Schema({
    profileimage: {
        type: String
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,    
    },
    password:{
        type:String,
        required:true
    },
    gender:{
        type:String,
    },
    age:{
        type:String
    },
    createdAt:{
        type: Date,
        default: Date.now 
    } 
})

const JournalSchema=mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required:true
    },
    context:{
        type:String,
        required:true
    }
})

const MoodSchema=mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        required:true
    },
    moodValue:{
        type:String,
        required:true
    }
})

const GoalSchema = new mongoose.Schema({
    userId: { 
        type: String,
         required: true 
    },
    text: {
         type: String,
          required: true 
    },
    completed: { 
        type: Boolean,
         default: false
    }
});


const User=mongoose.model("user",UserSchema)
const Journal=mongoose.model("journal",JournalSchema)
const Mood=mongoose.model("mood",MoodSchema)
const Goal=mongoose.model("goal",GoalSchema)
export {User,Journal,Mood,Goal}
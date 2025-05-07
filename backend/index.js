import express from 'express'
import mongoose from 'mongoose'
import route from './route.js'
import cors from 'cors'
import dotenv from 'dotenv'
import session from 'express-session'
import MongoStore from "connect-mongo";

dotenv.config();
const app = express();

app.set('trust proxy', 1);

app.use(cors({
    origin: 'https://moodly-1-lvyr.onrender.com',
    credentials: true,
}));

app.options("*", cors({
    origin: 'https://moodly-1-lvyr.onrender.com',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
    name: 'connect.sid',
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        collectionName: 'sessions',
        ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
        httpOnly:true,
        sameSite: 'none',
    },
}));
app.use('/uploads', express.static('uploads'));
const PORT=process.env.PORT || 5000
const MONGO_URL=process.env.MONGO_URL

mongoose.connect(MONGO_URL).then(()=>{
    console.log("Database Connected Successfully")
})
app.listen(PORT,()=>{
    console.log(`Server is Connnected To Port ${PORT}`)
})

app.use('/api',route)
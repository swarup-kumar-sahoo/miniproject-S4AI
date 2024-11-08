import express from "express";
import ImageKit from "imagekit";
import dotenv from 'dotenv';
import cors from "cors";
import path from "path"
import url, { fileURLToPath } from "url"
import mongoose from "mongoose";
import Chat from "./models/chat.js"
import UserChats from "./models/userChats.js";
// import {ClerkExpressRequireAuth} from "@clerk/clerk-sdk-node";
import { clerkMiddleware, requireAuth } from '@clerk/express';


dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true,
}))

app.use(express.json());


const connect = async() => {
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error)
    }
}

const imagekit = new ImageKit({
    urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

app.use(clerkMiddleware());

app.get("/protected", requireAuth(), (req, res) => {
    res.json({ message: 'You are authenticated!', user: req.auth });
});

app.get("/api/upload", (req, res) => {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
})

app.post("/api/chats", requireAuth(), async(req, res) => {
    try{

        const userId = req.auth.userId;
        const {text} = req.body
        
            const newChat = new Chat({
                userId: userId,
                history:[{role:"user", parts:[{text}]}],
            })

            const savedchat = await newChat.save();

            const userChats = await UserChats.find({userId:userId})

            if(!userChats.length){
                const newUserChats = new UserChats({
                    userId:userId,
                    chats:[
                        {
                            _id:savedchat._id,
                            title: text.substring(0, 40),
                        }
                    ]
                });

                await newUserChats.save();
            }else{
                await UserChats.updateOne(
                    {userId:userId},
                    {
                        $push:{
                            chats:{
                                _id:savedchat._id,
                                title: text.substring(0, 40),
                            }
                        }
                    }
                );

                res.status(201).send(newChat._id);
            }
            
    } catch (error) {
        console.log(error);
        res.status(500).send("Error in creating chat!")
    }
});

app.get("/api/userchats", requireAuth(), async (req,res)=>{
    const userId = req.auth.userId;
    try {

        const userChats = await UserChats.find({userId})
        res.status(200).send(userChats[0].chats);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error fetching userchat!")
    }
})

app.get("/api/chats/:id", requireAuth(), async (req,res)=>{
    const userId = req.auth.userId;
    try {

        const chat = await Chat.findOne({ _id: req.params.id, userId})
        res.status(200).send(chat);

    } catch (error) {
      console.log(error);
      res.status(500).send("Error fetching chat!")
    }
})

app.put("/api/chats/:id", requireAuth(), async (req,res)=>{
    const userId = req.auth.userId;
    const {question, answer, img} = req.body;

    const newItems = [
        ...(question ? [{role: "user", parts: [{ text:question }], ...(img && {img}) }] : []),
        { role : "model", parts: [{ text:answer}] },
    ]

    try {

        const updatedChat = await Chat.updateOne({ _id: req.params.id, userId }, {
            $push:{
                history: {
                    $each: newItems,
                },
            }
        })
        res.status(200).send(updatedChat);

    } catch (error) {
      console.log(error);
      res.status(500).send("Error adding conversation!")
    }
})

app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ 
      status: "error",
      message: err.message || "Internal server error" 
    });
  });

app.use(express.static(path.join(__dirname, "../client/dist")))

app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname, "../client/dist", "index.html"))
})

app.listen(port, ()=>{
    connect()
    console.log("Server running on 3000")
})
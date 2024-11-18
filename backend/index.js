import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import ImageKit from "imagekit";
import Chat from "./models/chat.js";
import UserChats from "./models/userChats.js";
import User from "./models/user.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to MongoDB
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Initialize ImageKit
const imagekit = new ImageKit({
  urlEndpoint: process.env.IMAGE_KIT_ENDPOINT,
  publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
  privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Route to get ImageKit authentication parameters
app.get("/api/upload", (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
  } catch (error) {
    console.error("Error generating upload parameters:", error);
    res.status(500).send("Error generating upload parameters!");
  }
});

// Signup Route
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    const newUser = new User({ username, password });
    const savedUser = await newUser.save();
    res.status(201).json({ userId: savedUser._id, message: "User registered successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login Route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    res.status(200).json({ userId: user._id, message: "Logged in successfully" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// Fetch chat by ID (GET method)
app.get("/api/chats/:id", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    console.error("Error fetching chat:", error);
    res.status(500).json({ message: "Error fetching chat" });
  }
});

// Fetch user chats
app.get("/api/userchats/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  try {
    const userChats = await UserChats.findOne({ userId });
    res.status(200).json(userChats?.chats || []);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    res.status(500).json({ message: "Error fetching user chats" });
  }
});

// Create new chat
app.post("/api/chats", async (req, res) => {
  const { userId, text } = req.body;
  if (!userId || !text) {
    return res.status(400).json({ message: "User ID and text are required" });
  }

  try {
    const newChat = new Chat({
      userId,
      history: [{ role: "user", parts: [{ text }] }]
    });
    const savedChat = await newChat.save();

    await UserChats.findOneAndUpdate(
      { userId },
      { $push: { chats: { _id: savedChat._id, title: text.substring(0, 30) } } },
      { upsert: true }
    );

    res.status(201).json({ id: savedChat._id });
  } catch (error) {
    console.error("Error creating chat:", error);
    res.status(500).json({ message: "Error creating chat" });
  }
});

// Update chat with new conversation (PUT method)
app.put("/api/chats/:id", async (req, res) => {
  const { userId, question, answer, imgUrl } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  const newItems = [
    ...(question ? [{ role: "user", parts: [{ text: question }] }] : []),
    ...(imgUrl ? [{ role: "user", parts: [], img: imgUrl }] : []),
    { role: "model", parts: [{ text: answer }] },
  ];

  try {
    const updatedChat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId },
      { $push: { history: { $each: newItems } } },
      { new: true }
    );
    
    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Error updating chat:", error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: "Invalid chat ID" });
    }
    res.status(500).json({ message: "Error updating chat" });
  }
});

// Add a new route to check if a chat exists
app.get("/api/chats/:id/exists", async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  try {
    const chat = await Chat.findOne({ _id: req.params.id, userId });
    res.status(200).json({ exists: !!chat });
  } catch (error) {
    console.error("Error checking chat existence:", error);
    res.status(500).json({ message: "Error checking chat existence" });
  }
});


// Start the server
app.listen(port, () => {
  connect();
  console.log(`Server running on port ${port}`);
});
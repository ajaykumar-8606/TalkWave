import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/database.js";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoute.js";
import { app, server } from "./socket/socket.js";
    
dotenv.config();

const PORT = process.env.PORT || 8080;

// middleware
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://chat-application-p7j6.onrender.com",
    ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Health check endpoint
app.get("/api/health", (req, res) => {
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    res.json({
        status: "ok",
        database: states[mongoose.connection.readyState] || "unknown",
        readyState: mongoose.connection.readyState,
        uptime: process.uptime()
    });
});

// Database connectivity check for API routes
app.use("/api", (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            error: "Database unavailable: MongoDB is not connected. Please ensure your MongoDB Atlas cluster is active and MONGODB_URI is updated.",
            success: false,
        });
    }
    next();
});

// routes
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to start server:", err);
    }
};

startServer();
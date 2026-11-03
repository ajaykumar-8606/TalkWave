import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
    try {
        const MONGO_URI = process.env.MONGODB_URI;
        
        if (!MONGO_URI) {
            console.error("Please provide MongoDB URI in environment variables");
            return;
        }

        if (mongoose.connection.readyState === 1) {
            console.log("MongoDB is already connected");
            return;
        }

        // Fail fast instead of buffering operations for 10000ms when disconnected
        mongoose.set("bufferCommands", false);

        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
    }
};

mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Retrying in 5s...");
    setTimeout(connectDB, 5000);
});

export default connectDB;

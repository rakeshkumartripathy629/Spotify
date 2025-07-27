import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./route.js"; // Uncomment when ready
const connectDb = async () => {
    try {
        const mongoUri = " add your mongo db url"; // ⬅️ Direct MongoDB URI here
        await mongoose.connect(mongoUri, {
            dbName: "Spotify", // Optional, you can name your DB
        });
        console.log("✅ MongoDB Connected");
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1); // Stop the server if DB connection fails
    }
};
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
// Routes
app.use("/api/v1", userRoutes);
app.get("/", (_req, res) => {
    res.send("Server is working ✅");
});
const port = 5000; // ⬅️ Hardcoded port
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
    connectDb();
});

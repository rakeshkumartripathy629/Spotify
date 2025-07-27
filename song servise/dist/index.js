import express from "express";
import songRoutes from "./route.js";
import redis from "redis";
import cors from "cors";
export const redisClient = redis.createClient({
    password: "add your password",
    socket: {
        host: "add your",
        port: 18107,
    },
});
redisClient
    .connect()
    .then(() => console.log("✅ Connected to Redis"))
    .catch(console.error);
const app = express();
app.use(cors());
app.use(express.json()); // Add this if handling JSON bodies
app.use("/api/v1", songRoutes);
const port = 3000; // ✅ Set your desired port here
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});

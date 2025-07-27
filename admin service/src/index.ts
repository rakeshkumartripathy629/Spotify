import express from "express";
import { sql } from "./config/db.js"; // ✅ Import db connection
import adminRoutes from "./route.js";
import cloudinary from "cloudinary";
import redis from "redis";
import cors from "cors";

//Redis config
export const redisClient = redis.createClient({
  password: "",
  socket: {
    host: "",
    port: 18107
  },
});

redisClient
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch(console.error);

// Cloudinary config
cloudinary.v2.config({
  cloud_name: "dp42r9yhm",
  api_key: "371542574218931",
  api_secret: "aU6H-wwqoqlxaC790tD_6qkS2fQ",
});

const app = express();

app.use(cors());
app.use(express.json());

// Create DB tables
async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS albums (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;

    await sql`
      CREATE TABLE IF NOT EXISTS songs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(255),
        audio VARCHAR(255) NOT NULL,
        album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`;

    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initializing DB:", error);
  }
}

app.use("/api/v1", adminRoutes);

const port = 8000;
initDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

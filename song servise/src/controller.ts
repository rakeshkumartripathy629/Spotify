import { sql } from "./config/db.js";
import TryCatch from "./TryCatch.js";
import { redisClient } from "./index.js";

const CACHE_EXPIRY = 1800; // 30 minutes

export const getAllAlbum = TryCatch(async (req, res) => {
  try {
    let albums;

    if (redisClient.isReady) {
      albums = await redisClient.get("albums");
    }

    if (albums) {
      console.log("Cache hit: albums");
      res.json(JSON.parse(albums));
    } else {
      console.log("Cache miss: albums");
      albums = await sql`SELECT * FROM albums`;

      if (redisClient.isReady) {
        await redisClient.set("albums", JSON.stringify(albums), {
          EX: CACHE_EXPIRY,
        });
        console.log("Albums cached in Redis");
      }

      res.json(albums);
    }
  } catch (err) {
    console.error("Error in getAllAlbum:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const getAllsongs = TryCatch(async (req, res) => {
  try {
    let songs;

    if (redisClient.isReady) {
      songs = await redisClient.get("songs");
    }

    if (songs) {
      console.log("Cache hit: songs");
      res.json(JSON.parse(songs));
    } else {
      console.log("Cache miss: songs");
      songs = await sql`SELECT * FROM songs`;

      if (redisClient.isReady) {
        await redisClient.set("songs", JSON.stringify(songs), {
          EX: CACHE_EXPIRY,
        });
        console.log("Songs cached in Redis");
      }

      res.json(songs);
    }
  } catch (err) {
    console.error("Error in getAllsongs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const getAllSongsOfAlbum = TryCatch(async (req, res) => {
  try {
    const { id } = req.params;

    if (redisClient.isReady) {
      const cached = await redisClient.get(`album_songs_${id}`);
      if (cached) {
        console.log(`Cache hit: album_songs_${id}`);
        return res.json(JSON.parse(cached));
      }
    }

    const album = await sql`SELECT * FROM albums WHERE id = ${id}`;
    if (album.length === 0) {
      return res.status(404).json({ message: "No album with this id" });
    }

    const songs = await sql`SELECT * FROM songs WHERE album_id = ${id}`;
    const response = { album: album[0], songs };

    if (redisClient.isReady) {
      await redisClient.set(`album_songs_${id}`, JSON.stringify(response), {
        EX: CACHE_EXPIRY,
      });
      console.log(`Cached: album_songs_${id}`);
    }

    console.log("Cache miss: album_songs_" + id);
    res.json(response);
  } catch (err) {
    console.error("Error in getAllSongsOfAlbum:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export const getSingleSong = TryCatch(async (req, res) => {
  try {
    const song = await sql`SELECT * FROM songs WHERE id = ${req.params.id}`;
    res.json(song[0]);
  } catch (err) {
    console.error("Error in getSingleSong:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

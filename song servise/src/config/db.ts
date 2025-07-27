import { neon } from "@neondatabase/serverless";

// Replace with your actual Neon connection string
const DB_URL: string = 'add yourURL';

export const sql = neon(DB_URL);

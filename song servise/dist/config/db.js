import { neon } from "@neondatabase/serverless";
// Replace with your actual Neon connection string
const DB_URL = 'postgresql://neondb_owner:npg_UC4SOlZfGRk3@ep-crimson-sunset-a1t1c5ad-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';
export const sql = neon(DB_URL);

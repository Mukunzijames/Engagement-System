import { drizzle } from 'drizzle-orm/neon-http';
import dotenv from 'dotenv';

dotenv.config();

const db = drizzle(process.env.DATABASE_URL as string);

export default db;

import { Pool } from "pg";
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema';

import * as dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
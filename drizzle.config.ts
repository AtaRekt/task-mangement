import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  out: './drizzle',
  dialect: "postgresql",
  schema: "./db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  }
});
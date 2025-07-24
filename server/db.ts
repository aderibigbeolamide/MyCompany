import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Only create database connection if DATABASE_URL is available
let pool: Pool | null = null;
let db: ReturnType<typeof drizzle> | null = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
  console.log('✅ PostgreSQL connection initialized');
} else {
  console.log('ℹ️ No DATABASE_URL found - PostgreSQL storage unavailable');
}

// Export with error handling
export { pool };
export { db };
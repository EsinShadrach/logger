import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

const dbUrl = process.env.TURSO_DATABASE_URL;
const dbAuthToken = process.env.TURSO_DATABASE_AUTH_TOKEN;

if (!dbUrl || !dbAuthToken) {
  throw new Error("Missing TURSO_DATABASE_URL or TURSO_DATABASE_AUTH_TOKEN");
}

const client = createClient({
  url: dbUrl,
  authToken: dbAuthToken,
});

export const db = drizzle(client);

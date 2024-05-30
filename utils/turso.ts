import { createClient } from "@libsql/client/web";

const DATABASE_URL = process.env.TURSO_DATABASE_URL;
const DATABASE_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!DATABASE_URL || !DATABASE_AUTH_TOKEN) {
  console.error(
    "No database URL or auth token found in environment variables. Exiting."
  );
  process.exit(0);
}

export const client = createClient({
  url: DATABASE_URL,
  authToken: DATABASE_AUTH_TOKEN,
});

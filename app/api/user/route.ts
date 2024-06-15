import { NextRequest } from "next/server";
import { User } from "~/db-handler/user";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const db = new User();
  const users = await db.getAllUsers();
  return new Response(JSON.stringify(users), {
    status: 200,
    statusText: "Success",
  });
}

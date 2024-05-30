import { NextRequest } from "next/server";
import { UpdateUserFields, User, UserSchema } from "~/db-handler/user";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  const db = new User();
  const users = await db.createUser({
    email: "rafe@mail.com",
    image: "img",
    username: "Rafe",
  });
  return new Response(JSON.stringify(users), {
    status: 200,
    statusText: "Success",
  });
}

export async function createUser(user: Omit<UserSchema, "authKey">) {
  const { email } = user;
  const db = new User();
  const userExists = await db.findByMail(email);

  if (!userExists) {
    const authKey = crypto.randomBytes(16).toString("hex");
    await db.createUser({ ...user, authKey });
  }
}

export async function updateUser(email: string, user: UpdateUserFields) {
  const db = new User();

  const userExists = await db.findByMail(email);
  if (userExists) {
    await db.updateUser(email, user);
  }
}

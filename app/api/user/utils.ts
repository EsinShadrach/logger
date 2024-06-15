import { UpdateUserFields, User, UserSchema } from "~/db-handler/user";
import crypto from "crypto";

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

import crypto from "crypto";
import { NextRequest } from "next/server";
import { User } from "~/db-handler/user";
import { connectToDB } from "~/utils/db";

export async function GET(req: NextRequest) {
  console.log(req);
  const db = new User();
  const users = await db.getAllUsers();
  console.log(users);
  return new Response(JSON.stringify(users), {
    status: 200,
    statusText: "Success",
  });
}

type UserParams = {
  email: string;
  username: string;
  image: string;
};

export async function createUser(user: UserParams) {
  // const { email } = user;
  // await connectToDB();
  // const userExists = await User.findOne({ email: email });
  // if (!userExists) {
  //   const authKey = crypto.randomBytes(16).toString("hex");
  //   console.log(authKey);
  //   console.log(user);
  //   // await User.create({
  //   //   ...user,
  //   //   authKey,
  //   // });
  // }
}

export async function updateUser(user: UserParams) {
  // const { email } = user;
  // await connectToDB();
  // const userExists = await User.findOne({
  //   email: email,
  // });
  // if (userExists) {
  //   await User.updateOne({ email: email }, user);
  // }
}

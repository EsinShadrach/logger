import { WebhookEvent } from "@clerk/nextjs/server";
import { User } from "~/db-handler/user";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { createUser, updateUser } from "../../user/utils";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  console.log("hello");

  if (!WEBHOOK_SECRET) {
    throw new Error(
      "Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local"
    );
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response("Error occured", {
      status: 400,
    });
  }

  const eventType = evt.type;

  if (eventType === "user.created") {
    const data = evt.data;

    createUser({
      email: data.email_addresses[0].email_address,
      image: data.image_url,
      username: data.username ?? "",
    });
  }

  if (eventType === "user.updated") {
    const data = evt.data;
    console.log(data);
    updateUser(data.email_addresses[0].email_address, {
      email: data.email_addresses[0].email_address,
      image: data.image_url,
      username: data.username ?? "",
    });
  }

  if (eventType === "user.deleted") {
    const data = evt.data;
    if (!data.id) {
      return;
    }
    const db = new User();
    await db.deleteUser(data.id);
  }

  return new Response("", { status: 200 });
}

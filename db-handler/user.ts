import { randomUUID } from "crypto";
import { client } from "~/utils/turso";
import crypto from "crypto";

export type UserSchema = {
  email: string;
  username: string;
  image: string;
  authKey: string;
};

export type UpdateUserFields = Partial<UserSchema>;

export class User {
  constructor() {
    this.createUserTable();
  }

  private async createUserTable() {
    console.log("~~~ Creating User Table ~~~");
    await client
      .execute(
        `
    CREATE TABLE IF NOT EXISTS user (
      id VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL,
      image VARCHAR(255) NOT NULL,
      authKey VARCHAR(255) NOT NULL,
      clerkId VARCHAR(255) NOT NULL,
    )
    `
      )
      .then(() => {
        console.log("~~~ User Table Created ~~~");
      })
      .catch((err) => {
        console.error("~~~ Error Creating User Table ~~~");
        console.log(err);
      });
  }

  async getAllUsers() {
    const users = await client.execute("SELECT * FROM users;");
    const toReturn = users.rows as unknown as UserSchema[];
    return toReturn;
  }

  async findByMail(email: string) {
    const sanitizedEmail = this.sanitizeInput(email);
    const user = await client.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [sanitizedEmail],
    });
    return user;
  }

  async createUser(userModel: UserSchema) {
    const uuid = randomUUID();
    const user = await client.execute({
      sql: "INSERT INTO users (id, email, username, image, authKey) VALUES ($id, $email, $username, $image, $authKey)",
      args: {
        id: uuid,
        email: this.sanitizeInput(userModel.email),
        username: this.sanitizeInput(userModel.username),
        image: this.sanitizeInput(userModel.image),
        authKey: crypto.randomBytes(16).toString("hex"),
      },
    });

    const toReturn = user.rows as unknown as UserSchema;
    console.log(toReturn);
    return toReturn;
  }

  async deleteUser(clerkId: string) {
    const sanitizedId = this.sanitizeInput(clerkId);
    const user = await client.execute({
      sql: "DELETE FROM users WHERE clerkId = ?",
      args: [sanitizedId],
    });
    return user;
  }

  async updateUser(userId: string, fieldsToUpdate: UpdateUserFields) {
    const setClause = Object.entries(fieldsToUpdate)
      .map(([key, _]) => `${key} = $${key}`)
      .join(", ");

    if (setClause != "") {
      const user = await client.execute({
        sql: `
        UPDATE users
        SET ${this.sanitizeInput(setClause)}
        WHERE email = $userId
      `,
        args: {
          ...fieldsToUpdate,
          userId,
        },
      });
      const toReturn = user.rows as unknown as UserSchema;
      return toReturn;
    }
  }

  private sanitizeInput(input: string) {
    const sanitizedInput = input.replace(/[^\w@\.\-]/gi, "");
    return sanitizedInput;
  }
}

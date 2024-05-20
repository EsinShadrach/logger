import { client } from "~/utils/turso";

type UserSchema = {
  email: string;
  username: string;
  image: string;
  authKey: string;
};

export class User {
  async getAllUsers() {
    const users = await client.execute("SELECT * FROM users");
    console.log(users);
    return users;
  }

  async findByMail(email: string) {
    const user = await client.execute({
      sql: "SELECT * FROM users WHERE email = ?",
      args: [email],
    });
    return user;
  }

  async createUser(userModel: UserSchema) {
    // // execute a statement with named arguments
    // const rs = await client.execute({
    //    sql: "SELECT * FROM books WHERE published_at > $year",
    //    args: {year: 1719},
    // });

    // // execute a statement with positional arguments
    const user = await client.execute({
      sql: "INSERT INTO users (email, username, image, authKey) VALUES ($email, $username, $image, $authKey)",
      args: {
        email: userModel.email,
        username: userModel.username,
        image: userModel.image,
        authKey: userModel.authKey,
      },
    });
    console.log(user);
    return user;
  }

  private sanitizeInput(params: any) {
    return Object.keys(params).reduce((acc, key) => {
      if (params[key] === undefined) {
        return acc;
      }
      return { ...acc, [key]: params[key] };
    }, {});
  }
}

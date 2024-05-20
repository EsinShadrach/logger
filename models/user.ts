import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Email already in use"],
    required: [true, "Email is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  image: {
    type: String,
  },
  authKey: {
    type: String,
    required: [true, "Please generate API key"],
  },
});

const User = models.User || model("User", UserSchema);

export default User;

// match: [
// 	/^[a-zA-Z0-9]+$/,
// 	"Username can only contain letters and numbers",
// ],//

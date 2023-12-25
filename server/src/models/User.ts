import { Schema, model, Document } from "mongoose";

interface User extends Document {
  username: string;
  password: string;
}

var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModel = model<User>("User", userSchema);

export { UserModel, User };

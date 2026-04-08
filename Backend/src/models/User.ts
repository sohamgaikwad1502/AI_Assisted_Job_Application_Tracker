import { Document, Schema, model } from "mongoose";

export interface UserDoc extends Document {
  email: string;
  passwordHash: string;
}

const userSchema = new Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);

export const User = model<UserDoc>("User", userSchema);

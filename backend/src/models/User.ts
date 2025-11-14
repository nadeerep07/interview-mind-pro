import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  language: string;
  stack: string[];  
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 8 },
    language: { type: String, default: "en" },
    stack: { type: [String], default: [] }, 
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);

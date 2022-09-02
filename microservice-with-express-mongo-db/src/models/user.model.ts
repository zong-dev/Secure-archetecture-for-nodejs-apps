import { Roles } from "@/utils/enums";
import { IUser } from "@/interfaces/IUser";
import mongoose from "mongoose";

const User = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter a full name'],
    index: true,
    unique: true,
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    index: true,
  },
  avatar: {
    type: String, default: ''
  },
  initSetup: { type: Boolean, default: false },
  password: String,
  salt: String,
  verified: { type: Boolean, default: false },
  lastLogin: Date,
  role: {
    type: Number,
    enum: Roles,
    default: Roles.BASIC,
  },
}, { timestamps: true, toJSON: { virtuals: true } });

export default mongoose.model<IUser & mongoose.Document>("User", User);
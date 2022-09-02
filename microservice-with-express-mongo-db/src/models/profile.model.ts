import { IProfile } from "@/interfaces/IProfile";
import mongoose from "mongoose";
import user from "./user.model";

const Profile = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: user },
    firstname: { type: String },
    lastname: { type: String },
    othername: { type: String },
    country: { type: String },
    state: { type: String },
    phone: String,
    dateOfBirth: Date,
    age: Number,
})

export default mongoose.model<IProfile & mongoose.Document>("Profile", Profile)
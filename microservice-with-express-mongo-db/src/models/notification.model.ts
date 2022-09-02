import { NotifyTypes } from "@/utils/enums";
import { INotification } from "@/interfaces/INotification";
import mongoose from "mongoose";
import user from "./user.model";


const Notification = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: user },
    data: {},
    notifiable_type: { type: Number, enun: NotifyTypes },
    readAt: { type: Date },
}, { timestamps: true, toJSON: { virtuals: true } });
export default mongoose.model<INotification & mongoose.Document>('Notification', Notification)
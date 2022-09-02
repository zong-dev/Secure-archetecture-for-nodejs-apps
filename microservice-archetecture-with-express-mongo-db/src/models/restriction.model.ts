import { IRestriction } from '@/interfaces/IRestriction';
import mongoose from 'mongoose';
import user from './user.model';

const Restriction = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: user },
    cause: String,
    duration: { type: Number, default: 0 },
    active: { type: Boolean, default: true}
}, { timestamps: true, toJSON: { virtuals: true } });

export default mongoose.model<IRestriction & mongoose.Document>("Restriction", Restriction)
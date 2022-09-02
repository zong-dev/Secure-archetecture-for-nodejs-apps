import config from '@/config';
import { IMedia } from '@/interfaces/IMedia';
import mongoose from 'mongoose';
import user from './user.model';
const Media = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: user },
    url: {type: String},
    path: {type: String},
    type: {type: String},
    public_id: { type: String},
    deletedAt: { type: Date}
}, { timestamps: true, toJSON: { virtuals: true } });

Media.pre('deleteOne', function(next){
    this.deletedAt = new Date();
    this.save();
})

export default mongoose.model<IMedia & mongoose.Document>("Media", Media)
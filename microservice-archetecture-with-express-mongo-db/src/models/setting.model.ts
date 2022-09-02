import config from '@/config';
import { NotifyTypes } from '@/utils/enums';
import { ISetting } from '@/interfaces/ISetting';
import mongoose from 'mongoose';
import user from './user.model';

const Setting = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: user },
    language: { type: String, default: config.defaultLang },
    notifyType: { type: Number, enum: NotifyTypes, default: NotifyTypes.BOTH },
    allow2FA: { type: Boolean, default: false }
});

export default mongoose.model<ISetting & mongoose.Document>("Setting", Setting)
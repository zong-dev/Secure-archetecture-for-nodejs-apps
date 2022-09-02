import config from '@/config';
import { IToken } from '@/interfaces/IToken';
import { TokenUses } from '@/utils/enums';
import mongoose from 'mongoose';
import user from './user.model';

const Token = new mongoose.Schema({
    user: { type: mongoose.Types.ObjectId, ref: user },
    value: String,
    type: { type: String, enum: TokenUses },
    expireAt: {type: Date},
    duration: { type: Number, default: config.token.expirationTime },
}, { timestamps: true, toJSON: { virtuals: true } } );

export default mongoose.model<IToken & mongoose.Document>("Token", Token)
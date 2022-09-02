import { Container } from 'typedi';
import { IUser } from '@/interfaces/IUser';
import mongoose from 'mongoose';
import { Logger } from 'winston';

/**
 * Check if user is account Verified
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const verified = async (req, res, next) => {
    const Logger: Logger = Container.get('logger');
    try {
        const UserModel = Container.get('userModel') as mongoose.Model<IUser & mongoose.Document>;
        const userRecord = await UserModel.findOne({ where: { _id: req.user._id } });
        if (userRecord && userRecord.verified) {
            return next();
        }
        return res.sendStatus(401).json("Account Unverified");
    } catch (e) {
        Logger.error('🔥 Error attaching user to req: %o', e);
        return next(e);
    }
}

export default verified
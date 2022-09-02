import { Container } from 'typedi';
import { Logger } from 'winston';
import mongoose from 'mongoose';
import { Roles } from '@/utils/enums';
import { IUser } from '@/interfaces/IUser';
import { IRestriction } from '@/interfaces/IRestriction';

/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const hasRestrictions = async (req, res, next) => {
    const Logger: Logger = Container.get('logger');
    try {
        const user = req.user;
        const restrictionModel = Container.get('restrictionModel') as mongoose.Model<IRestriction & mongoose.Document>;
        const restrictionRecord = restrictionModel.findOne({ user: user._id, active: true })
        if(restrictionRecord) {
            return res.sendStatus(401).json("Account is restricted");
        }
        return next();
    } catch (e) {
        Logger.error('🔥 Error attaching user to req: %o', e);
        return next(e);
    }
}

export default hasRestrictions
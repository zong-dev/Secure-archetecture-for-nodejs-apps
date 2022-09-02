import { Container } from 'typedi';
import { Logger } from 'winston';
import { Roles } from '@/utils/enums';

/**
 * Attach user to req.currentUser
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const admin = async (req, res, next) => {
    const Logger: Logger = Container.get('logger');
    try {
        const userRecord = req.user;
        if (!userRecord || (userRecord && userRecord.role !== Roles.ADMIN)) {
            return res.sendStatus(401).json("Unauthorized");
        }
        return next();
    } catch (e) {
        Logger.error('🔥 Error attaching user to req: %o', e);
        return next(e);
    }
}

export default admin
import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi, Segments } from 'celebrate';
import { Container } from "typedi";
import { Logger } from 'winston';
import config from '@/config';
import NotificationService from '@/services/notification.service';
import { IUser } from '@/interfaces/IUser';

const route = Router();
export default (app: Router) => {

    const DOCUMENT_SIZE = config.pagination.size;
    const logger: Logger = Container.get('logger');
    const notificationService = Container.get(NotificationService)

    app.use('/notifiables', route)


    route.get('/',
        celebrate({
            [Segments.QUERY]: Joi.object({
                page: Joi.number().integer()
            })
        }),
        middlewares.routes.auth, middlewares.routes.attachUser, middlewares.routes.verified,
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Calling Get-Notifications endpoint with body: %o', req.body);
            try {

                const { page } = req.query;
                const user = req.user;
                const notifications = await notificationService.Notifications(parseInt(page.toString()), DOCUMENT_SIZE, user)
                return res.json(notifications).status(200)

            } catch (e) {
                logger.error('🔥 error: %o', e);
                return next(e);
            }
        }
    )
}
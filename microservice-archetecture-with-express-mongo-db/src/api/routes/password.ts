import { IResetPasswordInput } from '@/interfaces/IResetPassword';
import { IUser } from '@/interfaces/IUser';
import PasswordService from '@/services/password.service';
import { celebrate, Joi, Segments } from 'celebrate';
import { Router, Request, Response, NextFunction } from 'express';
import { Container } from "typedi";
import { Logger } from 'winston';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
    app.use('/password', route);
    const passwordService = Container.get(PasswordService);
    const logger: Logger = Container.get('logger');

    route.post('/send-reset-mail', celebrate({
        [Segments.BODY]: Joi.object({
            email: Joi.string().email().required(),
        })
    }), async (req: Request, res: Response, next: NextFunction) => {
        logger.debug('Calling Password-Mail endpoint with body: %o', req.body);
        try {
            const resendMail = await passwordService.SendResetPasswordEmail(req.body);
            return res.json(resendMail).status(200);
        } catch (e) {
            logger.error('🔥 error: %o', e);
            next(e)
        }
    });

    route.post('/reset/:token', celebrate({
        [Segments.BODY]: Joi.object({
            user: Joi.string(),
            password: Joi.string(),
        }),
        [Segments.PARAMS]: Joi.object({
            token: Joi.string().required()
        })
    }), async (req: Request, res: Response, next: NextFunction) => {
        logger.debug('Calling Password-Mail endpoint with body: %o', req.body);
        try {
            console.log(req.body)
            const resetPassword = await passwordService.ResetPassword(req.body as IResetPasswordInput, req.params.token as String);
            return res.json(resetPassword).status(200);
        } catch (e) {
            logger.error('🔥 error: %o', e);
            next(e)
        }
    })

    route.post('/change',
        middlewares.routes.auth,
        middlewares.routes.attachUser,
        middlewares.routes.verified,
        celebrate({
            [Segments.BODY]: Joi.object({
                current_password: Joi.string().required().min(6),
                new_password: Joi.string().required().min(6),
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Calling Update-Profile endpoint with body: %o', req.body);
            try {
                const passwordUpdate = passwordService.ChangePassword(req.user._id as String, req.body)
                return res.json(passwordUpdate).status(200);
            } catch (e) {
                logger.error('🔥 error: %o', e);
                return next(e);
            }
        }
    )
}

import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { IUserInput } from '@/interfaces/IUser';
import middlewares from '../middlewares';
import { celebrate, Joi, Segments } from 'celebrate';
import { Logger } from 'winston';
import AuthService from '@/services/auth.service';

const route = Router();

export default (app: Router) => {

    const authService = Container.get(AuthService);
    const logger: Logger = Container.get('logger');

    app.use('/auth', route);

    route.post(
        '/signup',
        celebrate({
            [Segments.BODY]: Joi.object({
                name: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required(),
            }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
            try {
                const { user, token } = await authService.SignUp(req.body as IUserInput);
                return res.status(201).json({ user, token });
            } catch (e) {
                logger.error('🔥 error: %o', e);
                return next(e);
            }
        },
    );

    route.post(
        '/signin',
        celebrate({
            body: Joi.object({
                email: Joi.string().required(),
                password: Joi.string().required(),
            }),
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Calling Sign-In endpoint with body: %o', req.body);
            try {
                const { email, password } = req.body;
                const { user, token } = await authService.SignIn(email, password);
                return res.json({ user, token }).status(200);
            } catch (e) {
                logger.error('🔥 error: %o', e);
                return next(e);
            }
        },
    );

    route.post('/verify-account/:user', celebrate({
        [Segments.BODY]: Joi.object({
            token: Joi.string().required(),
        }),
        [Segments.PARAMS]: Joi.object({
            user: Joi.string().required(),
        })
    }),
        middlewares.routes.auth,
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Calling Verify-Account endpoint with body: %o', req.body);

            try {
                const token = req.body.token;
                const user = req.params.user;
                const verification = await authService.VerifyAccount(token, user);
                return res.status(200).json(verification);
            } catch (e) {
                logger.error('🔥 error: %o', e);
                return next(e);
            }
    });

    

    /**
     * @TODO Let's leave this as a place holder for now
     * The reason for a logout route could be deleting a 'push notification token'
     * so the device stops receiving push notifications after logout.
     *
     * Another use case for advance/enterprise apps, you can store a record of the jwt token
     * emitted for the session and add it to a black list.
     * It's really annoying to develop that but if you had to, please use Redis as your data store
     */
    route.post('/signout', middlewares.routes.auth, (req: Request, res: Response, next: NextFunction) => {
        logger.debug('Calling Sign-Out endpoint with body: %o', req.body);
        try {
            //@TODO AuthService.Logout(req.user) do some clever stuff
            return res.status(200).end();
        } catch (e) {
            logger.error('🔥 error %o', e);
            return next(e);
        }
    });
};

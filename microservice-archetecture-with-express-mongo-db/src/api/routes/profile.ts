import { Router, Request, Response, NextFunction } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi, Segments } from 'celebrate';
import { Logger } from 'winston';
import { Container } from 'typedi';
import multer from 'multer';
import config from '@/config';
import ProfileService from '@/services/profile.service';
import { IUser, IUserInputDTO } from '@/interfaces/IUser';


const route = Router();
const forms = multer({ storage: multer.memoryStorage(), limits: { fileSize: config.filesystem.maxSize } })

export default (app: Router) => {
    app.use('/profile', route);

    const profileService = Container.get(ProfileService);
    const logger: Logger = Container.get('logger');

    route.post('/set-up', middlewares.routes.auth, middlewares.routes.attachUser, middlewares.routes.verified, celebrate({
        [Segments.BODY]: Joi.object({
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            othername: Joi.string().allow(''),
            country: Joi.string().required(),
            state: Joi.string().required(),
            dateOfBirth: Joi.date(),
            phone: Joi.string().required(),
        })
    }), async (req: Request, res: Response, next: NextFunction) => {
        logger.debug('Calling Initial-Setup endpoint with body: %o', req.body);
        try {
            const setup = profileService.InitialSetup(req.user as IUser, req.body);
            return res.json({ profile: setup }).status(200);
        } catch (e) {
            logger.error('🔥 error: %o', e);
            return next(e);
        }
    })

    route.post('/upload-avatar',
        middlewares.routes.auth,
        middlewares.routes.attachUser,
        middlewares.routes.verified, forms.single('avatar'),
        async (req: Request, res: Response, next: NextFunction) => {
        
            logger.debug('Calling Upload-Avatar endpoint with body: %o', req.body);
            try {
                const file = req['file'];
                const user = profileService.UpdateAvatar(req.user as IUser, file);
                return res.status(200).json({ user });
            } catch (e) {
                logger.error('🔥 error: %o', e);
                return next(e);
            }
        });

    route.put('settings/update',
        middlewares.routes.auth,
        middlewares.routes.attachUser,
        middlewares.routes.verified,
        celebrate({
            [Segments.BODY]: Joi.object({
                language: Joi.string().required(),
                notify: Joi.number().integer(),
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Calling Update-Setting endpoint with body: %o', req.body);
            try {
                const setting = profileService.UpdateSetting(req.user as IUser, req.body);
                return res.status(200).json(setting)
            } catch (e) {
                logger.error('🔥 error: %o', e);
                return next(e);
            }
        }
    )

    route.put('/update',
        middlewares.routes.auth,
        middlewares.routes.attachUser,
        middlewares.routes.verified,
        celebrate({
            [Segments.BODY]: Joi.object({
                firstname: Joi.string().required(),
                lastname: Joi.string().required(),
                othername: Joi.string().allow(''),
                country: Joi.string().required(),
                state: Joi.string().required(),
                dateOfBirth: Joi.date(),
                phone: Joi.string().required(),
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
        
            logger.debug('Calling Update-Profile endpoint with body: %o', req.body);
            try {
                ;
                const profile = profileService.UpdateProfile(req.user, req.body)
                return res.json(profile).status(200);
            } catch (e) {
                logger.error('🔥 error: %o', e);
                return next(e);
            }
        }
    )


}
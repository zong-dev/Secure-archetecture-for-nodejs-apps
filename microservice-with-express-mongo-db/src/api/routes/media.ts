import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import multer from 'multer';
import path from 'path';
import { celebrate, Joi, Segments } from 'celebrate';
import middlewares from '../middlewares';
import { Logger } from 'winston';
import MediaService from '@/services/media.service';
import config from '@/config';
import { IUser } from '@/interfaces/IUser';

const route = Router();

export default (app: Router) => {

    app.use('/media', route);

    const mediaService = Container.get(MediaService);
    const logger: Logger = Container.get('logger');

    const form = multer({ storage: multer.memoryStorage(), limits: { fileSize: config.filesystem.maxSize } })

    route.post('/upload-file', form.single('file'), middlewares.routes.auth, middlewares.routes.attachUser,
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Calling Media-Upload endpoint');
            try {
                const mediaUpload = await mediaService.AddFile(req['file'], req.user as Partial<IUser>)
                return res.json(mediaUpload).status(200);
            } catch (e) {
                logger.error('🔥 error: %o', e);
                return next(e);
            }
        }
    );

    
}

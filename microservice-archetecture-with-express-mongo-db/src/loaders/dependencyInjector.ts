import { Container } from 'typedi';
import formData from 'form-data';
import LoggerInstance from './logger';
import agendaFactory from './agenda';
import mailer from './mailer';
import cloudinary from './cloudinary';
import awsS3 from './aws';
import redisClient from './redis';

export default ({mongoConnection, models}: { mongoConnection; models: {name: string, model: any} []}) => {

    try {

        models.forEach(m => {
            Container.set(m.name, m.model);
        });

        const agendaInstance = agendaFactory({ mongoConnection });
        Container.set('agendaInstance', agendaInstance);

        Container.set('logger', LoggerInstance);
        Container.set('mailer', mailer);
        Container.set('cloudinary', cloudinary);
        Container.set('awsS3', awsS3)
        Container.set('redisClient', redisClient)

        LoggerInstance.info('✌️ Agenda injected into container');

        return { agenda: agendaInstance };
        
    } catch (err) {
        LoggerInstance.error('🔥 Error on dependency injector loader: %o', err);
        throw err;
    }

}
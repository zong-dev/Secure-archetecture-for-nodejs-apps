import expressLoader from './express';
import http from 'http';
import dependencyInjector from './dependencyInjector';
import mongooseLoader from './mongoose';
import dependencyInjectorLoader from './dependencyInjector';
import jobsLoader from './jobs';
import Logger from './logger';
import Websocket from './socket';
//We have to import at least all the events once so they can be triggered
import './events';
import { models } from './models';

export default async ({ expressApp }) => {
    const mongoConnection = await mongooseLoader();
    Logger.info('✌️ DB loaded and connected!');
   
    // It returns the agenda instance because it's needed in the subsequent loaders
    const { agenda } = await dependencyInjectorLoader({
        mongoConnection,
        models: [
            ...models
        ],
    });

    Logger.info('✌️ Dependency Injector loaded');

    await jobsLoader({ agenda });
    Logger.info('✌️ Jobs loaded');

    await expressLoader({ app: expressApp, mongoConnection });
    Logger.info('✌️ Express loaded');

    const server = http.createServer(expressApp);
    await Websocket(server);
    Logger.info('✌️ Websocket Loaded');

}
import middlewares from '@/api/middlewares';
import Logger from '@/loaders/logger';
import { Server } from 'socket.io';
import { Container } from 'typedi';

export default (io: Server) => {

    io.use(middlewares.socket.authSocket)
    .on('connection', (socket) => {

        Container.set('socket', socket);
        Logger.info('✌️ Websocket Connection Established');
        

        socket.on("disconnect", () => {
            Logger.info('✌️ Websocket Connection Desolved');
        })
    })
    
}
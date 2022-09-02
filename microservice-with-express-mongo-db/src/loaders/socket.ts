import { Server } from 'socket.io';
import config from '@/config';
import plugs from '@/plugs';

export default server => {

    let url = `https://${config.domain}`;

    const io = new Server(server, {
        cors: {
            origin: url,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    plugs(io);
    
    return io;
}
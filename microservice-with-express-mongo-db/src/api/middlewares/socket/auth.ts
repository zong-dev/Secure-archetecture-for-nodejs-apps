import jwt from 'express-jwt';
import config from '@/config';

const authSocket = (socket, next) => {
    if (socket.handshake?.query?.token) {
        const tokenVerified = jwt({
            secret: config.jwtSecret, // The _secret_ to sign the JWTs
            algorithms: [config.jwtAlgorithm.toString()], // JWT Algorithm
            userProperty: 'token', // Use req.token to store the JWT
            getToken: socket.handshake?.query?.token, // How to extract the JWT from the request
        });

        if (!tokenVerified) next(new Error('Authentication error'));

        next();
    }
}

export default authSocket;
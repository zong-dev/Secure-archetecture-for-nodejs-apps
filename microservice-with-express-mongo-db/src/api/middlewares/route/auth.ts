import jwt from 'express-jwt';
import config from '@/config';
const getTokenFromHeader = req => {
    /**
     * @TODO Edge and Internet Explorer do some weird things with the headers
     * So I believe that this should handle more 'edge' cases ;)
     */
    if (
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};

const auth = jwt({
    secret: config.jwtSecret, // The _secret_ to sign the JWTs
    algorithms: [config.jwtAlgorithm.toString()], // JWT Algorithm
    userProperty: 'token', // Use req.token to store the JWT
    getToken: getTokenFromHeader, // How to extract the JWT from the request
});

export default auth;
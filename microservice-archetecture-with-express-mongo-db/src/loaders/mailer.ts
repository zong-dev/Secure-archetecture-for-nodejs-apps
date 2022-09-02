import nodemailer from 'nodemailer';
import config from '../config';

export default () => {
    return nodemailer.createTransport({
        host: config.email.host,
        port: parseInt(config.email.port),
        auth: {
            user: config.email.username,
            pass: config.email.password,
        },
    });
}
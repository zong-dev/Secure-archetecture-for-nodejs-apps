import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();

if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}


export default {

    name: process.env.APP_NAME,

    secret: process.env.APP_SECRET,

    domain: process.env.APP_DOMAIN,

    client: process.env.CLIENT_URL,
    
    /**
     * Your favorite port
     */
    port: process.env.APP_PORT,
    /**
     * Used by winston logger
     */
    
    /**
     * That long string from mlab
     */
    databaseURL: process.env.MONGODB_URI,
    
    /**
     * Your secret sauce
     */
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgorithm: process.env.JWT_ALGO,

    filesystem: {
        maxSize: process.env.FILE_MAXIMUM_SIZE,
        allowExt: ['jpg', 'svg', 'png', 'jpeg', 'gif'],
        storage: process.env.STORAGE_TYPE,
    },

    pagination: {
        size: parseInt(process.env.PAGINATE_SIZE)
    },
    
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    
    /**
     * Agenda.js stuff
     */
    agenda: {
        dbCollection: process.env.AGENDA_DB_COLLECTION,
        pooltime: process.env.AGENDA_POOL_TIME,
        concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
    },
    
    /**
     * Agendash config
     */
    agendash: {
        user: process.env.DASH_USER,
        password: process.env.DASH_WORD
    },
    /**
     * API configs
     */
    api: {
        prefix: process.env.API_PREFIX,
    },


    auth: {
        mustVerify: true,
    },

    defaultLang: process.env.LANG,
    /**
     * email credentials
     */
    email: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        username: process.env.MAIL_USERNAME,
        password: process.env.MAIL_PASSWORD,
        secureMail: process.env.MAIL_SECURITY,
        requireTls: true
    },

    token: {
        expirationTime: parseInt(process.env.TOKEN_EXPIRATION_TIME),
        expirationType: process.env.TOKEN_EXPIRATION_TYPE.toString(),
        length: parseInt(process.env.TOKEN_LENGTH),
        type: parseInt(process.env.TOKEN_TYPE)
    },

    redis:{
        url: process.env.REDIS_URL || 'localhost',
    },

    cloudinary: {
        cloud_name: process.env.CDN_CLOUND_NAME,
        api_key: process.env.CDN_API_KEY,
        secret: process.env.CDN_SECRET
    },

    aws: {
        region: 'ap-south-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        bucketName: process.env.AWS_S3_BUCKET
    }

}
import config from '@/config';
import AWS from 'aws-sdk';

export default () => {
    AWS.config.update({
        region: config.aws.region,
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
    });

    const s3 = new AWS.S3();

    return s3;
}
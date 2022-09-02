import redis from "redis";
import config from '@/config'

export default () => {
    const redisClient = redis.createClient({
        url: config.redis.url,
    });

    return redisClient
}
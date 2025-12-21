import { Redis } from "ioredis";

const redisHost =process.env.REDIS_HOST || "127.0.0.1";
const redisPort =Number(process.env.REDIS_PORT) || 6379;

export const redisConnection=new Redis({
    host:redisHost,
    port:redisPort
});


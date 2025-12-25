import Redis from "ioredis"; 
import IORedis from "ioredis";

const redisConnection: Redis=new IORedis(
    {
        host:process.env.REDIS_HOST,
        port:Number(process.env.REDIS_PORT) || 6379,
        maxRetriesPerRequest:null
    }
);

redisConnection.on("connect", () => {
  console.log("Connected to Redis");
});

redisConnection.on("error", (err) => console.error("Redis connection error:", err));

export default redisConnection;
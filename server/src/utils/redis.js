import IORedis from 'ioredis';

const {REDIS_URL} = process.env

console.log("Connecting to Redis : ", REDIS_URL)

const redisConnection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null
});

export default redisConnection;
export { redisConnection };
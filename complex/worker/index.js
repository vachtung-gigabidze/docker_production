// import keys from './keys.js';
import redis from 'redis';

const redisClient = await redis.createClient({
    // host: keys.redisHost,
    // port: keys.redisPort,
    url: 'redis://redis-server:6379',
    retry_strategy: () => 1000
}).on('error', err => console.log('Redis Client Error', err)).connect();

const sub = redisClient.duplicate();

await sub.connect();

function fib(index) {  
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}
await sub.subscribe('insert', (message) => {
    const value = parseInt(message);
    if (Number.isInteger(value)){

        console.log("Subscriber 1 received:", value);
        redisClient.hSet('values', value, fib(value));
    }
    else {
        console.log("Does not integer:", value);
    }
}, true);
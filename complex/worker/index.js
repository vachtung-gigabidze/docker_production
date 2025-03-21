import keys from './keys.js';
import { createClient } from 'redis';

const redisClient = createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

function fib(index)
{
    if (index < 2 ) return 1;
    return fin(index-1) + fib(index-2)
}

sub.on('message', (channel, message) => {
    redisClient.hset('value', message, fib(parseInt(message)));
});
import { redisHost, redisPort } from './keys';
import { createClient } from 'redis';

const redisClient = createClient({
    host: redisHost,
    port: redisPort,
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
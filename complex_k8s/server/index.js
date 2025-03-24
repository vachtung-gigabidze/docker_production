import keys from './keys.js';

import express from 'express';
import bodyParser  from 'body-parser';
import cors from 'cors';


import process from 'process';

const app = express();
const key = 'values';

app.use(cors())
app.use(bodyParser.json());

// PostgreSQL
import pg from "pg";
const { Pool } = pg;

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});
pgClient.on('error', ()=> console.log('Lost PG connect'));

pgClient.query('CREATE TABLE IF NOT EXISTS values (number INT)')
    .catch(err => console.log(err));

// Redis
import { createClient } from 'redis';
const redisClient = await createClient({ 
    url: 'redis://redis-server:6379' ,
    retry_strategy: () => 1000

})
.on('error', err => console.log('Redis Client Error', err)).connect();

const redisPublisher = redisClient.duplicate();
await redisPublisher.connect();

//client.set(key, 0);

// Express route handlers

app.get('/', (req, res) => {
    res.send('Hi');
  });
  
  app.get('/values/all', async (req, res) => {
    // const values = await pgClient.query('SELECT * from values');
  
    res.send([1, 2, 3]);
  });
  
  app.get('/values/current', async (req, res) => {
    const values = await redisClient.hGetAll('values');
    console.log(values);
    res.send(values);
    
  });
  
  app.post('/values', async (req, res) => {
    const index = req.body.index;
  
    if (parseInt(index) > 40) {
      return res.status(422).send('Index too high');
    }
  
    redisClient.hSet('values', index, 'Nothing yet!');

    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
  
    res.send({ working: true });
  });
  
  app.listen(5000, err => {
    console.log('Listening');
  });
import keys from './keys';

import express from 'express';
import bodyParser  from 'body-parser';
import cors from 'cors';

import { createClient } from 'redis';
import process from 'process';

const app = express();
const key = 'visits';

app.use(cors())
app.use(bodyParser.json());

// PostgreSQL
import {Pool} from 'pg';
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


const redisClient = await createClient({ 
    url: 'redis://redis-server:6379' ,
    retry_strategy: () => 1000

})
.on('error', err => console.log('Redis Client Error', err)).connect();

const redisPublisher = redisClient.duplicate();

//client.set(key, 0);

// Express

app.get("/", async (req, res) => {
    res.send('Hi')
});

app.get("/values/all", async (req, res) => {
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
    const values = await redisClient.hgetall('values');
    res.send(values);
});
app.post("/values", async (req, res) => {
    const index = req.body.index;
    if (index > 40) {
        res.status(422).send("Слишком большое значение");
    }
    res.send(values);
});


app.listen(8081, ()=>{
    console.log("Server run on 8081")
})

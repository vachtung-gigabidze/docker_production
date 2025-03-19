import express from 'express';
import { createClient } from 'redis';
import process from 'process';

const app = express();
const key = 'visits';

const client = await createClient({ url: 'redis://redis-server:6379' })
.on('error', err => console.log('Redis Client Error', err)).connect();

client.set(key, 0);

app.get("/", async (req, res) => {
    process.exit(333)
    const visits = await client.get(key); 

    res.send(`${key} ${visits}`)
    await client.set(key, parseInt(visits) + 1)
   // })
})

app.listen(8081, ()=>{
    console.log("Server run on 8081")
})
import express from 'express';
const app = express();
import getQueueChannel from "./config/queue.js";
import dotenv from 'dotenv';
import {initExchanges,consumeFromRawExceptionQueue} from "./util/rabbitManager.js";


dotenv.config();


initExchanges().then(async ()=>{
    await consumeFromRawExceptionQueue()
}).catch((err)=>{
    console.log("Error reading queue channel")
});

app.listen(process.env.PORT,
    () => console.log(`Express server listening on ${ process.env.PORT }`));
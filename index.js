import express from 'express';
const app = express();
import getQueueChannel from "./config/queue.js";
import dotenv from 'dotenv';
 import {initExchanges,consumeFromRawExceptionQueue} from "./util/rabbitManager.js";


dotenv.config();

// import getGroqChatCompletion from "./config/groq.js";
//
// getGroqChatCompletion("how does universe work").then(result => {
//     console.log(result)
// })

getQueueChannel().then(async ()=>{
    await initExchanges()
    await consumeFromRawExceptionQueue()
}).catch((err)=>{
    console.log("Error reading queue channel")
});

app.listen(process.env.PORT,
    () => console.log(`Express server listening on ${ process.env.PORT }`));
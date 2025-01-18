import getQueueChannel from "../config/queue.js";
import getGroqChatCompletion from "../config/groq.js";
const processedExchange = 'processedExchange'
const rawExchange = 'rawExchange'

var channel = null
var rawExceptionQueue = null
var emailQueue = null
var dbQueue = null


export async function initExchanges() {

    try{

        channel = await getQueueChannel()

        await channel.assertExchange(rawExchange,"fanout",{durable:true})
        await channel.assertExchange(processedExchange,"fanout",{durable:true})


        rawExceptionQueue = await channel.assertQueue("rawExceptionQueue",{durable:true,autoDelete:false})
        emailQueue = await channel.assertQueue("emailQueue",{durable:true,autoDelete:false})
        dbQueue = await channel.assertQueue("dbQueue",{durable:true,autoDelete:false})

        await channel.bindQueue(rawExceptionQueue.queue,rawExchange,'')
        await channel.bindQueue(emailQueue.queue,processedExchange,'')
        await channel.bindQueue(dbQueue.queue,processedExchange,'')


        console.log("Successfully initialized queues and exchanges")

    }
    catch(Err){
        console.log(Err)
    }
}

export async function publishToProcessed(data) {
    try{
        if (channel == null){
            console.log("Exchange not initialized")
            throw Error("Channel not initialized")
        }
        await channel.publish(processedExchange,'',Buffer.from(JSON.stringify(data)),{persistent:true})
        return true
    }
    catch(err){
        console.log(err)
        return false
    }
}

export async function consumeFromRawExceptionQueue() {

    try{
        if (channel == null){
            console.log("Exchange not initialized")
            throw Error("Channel not initialized")
        }

        channel.consume(rawExceptionQueue.queue,async(message)=>{
            if(message.content){

                let data = JSON.parse(message.content)

                data.llmResponse = await getGroqChatCompletion("just provide me the idea to solve the problem dont give any code just give a possible way to solve and describe the probable cause of problem , also give answer without new line \n"+data.exception.stack)
                await publishToProcessed(data)
                channel.ack(message)

            }
        },{noAck:false})

    }
    catch(err){
        console.log(err)

    }
}

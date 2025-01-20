import amqplib from "amqplib";
import dotenv from "dotenv";
dotenv.config()

const RABBIT_MQ_HOST = process.env.RABBIT_MQ_HOST
const RABBIT_MQ_PORT = process.env.RABBIT_MQ_PORT
const RABBIT_MQ_USER = process.env.RABBIT_MQ_USER
const RABBIT_MQ_PASSWORD = process.env.RABBIT_MQ_PASSWORD

var channel = null

async function getQueueChannel(){
    try{

        if (channel ){
            return channel
        }

        const connection = await amqplib.connect(`amqp://${RABBIT_MQ_USER}:${RABBIT_MQ_PASSWORD}@${RABBIT_MQ_HOST}:${RABBIT_MQ_PORT}`)

        channel = await connection.createChannel()
        console.log("Rabbit Mq connected")
        return channel
    }
    catch(err){
        console.log(err)
    }
}

export default getQueueChannel;
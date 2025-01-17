import Groq from "groq-sdk";
import dotenv from "dotenv";


dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion(question) {
    const res = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: question,
            },
        ],
        model: "llama-3.3-70b-versatile",
    });

    return res.choices[0]?.message?.content || "";
}

export default getGroqChatCompletion;

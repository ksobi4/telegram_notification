import express from 'express'
import { Request, Response } from "express";
import { config } from 'dotenv';
config({ path: '.env' });
import { Message, SendMessageOptions } from 'node-telegram-bot-api'
import TelegramBot from 'node-telegram-bot-api'

import logger from './utils/logger';

const PORT = process.env.PORT;
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const MY_CHAT_ID = process.env.MY_CHAT_ID ?? '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '';

const app = express();
app.use(express.json({ strict: false }));

let bot: TelegramBot
try {
    bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

    bot.on('message', async (msg: Message) => {
        const chatId = msg.chat.id;
        if (msg.text == '/start') {
            bot.sendMessage(chatId, `Hello your chatId = ${chatId}`);
        }
    })

    logger.info("Telegram BOT connected successfully")
} catch (error) {
    logger.error(`Cannot connect with TELEGRAM ${error}`)

}




app.post('/send_message', async (req: Request, res: Response) => {
    let { text, token } = req.body;

    if (token != process.env.AUTH_TOKEN) {
        res.status(400).send('Bad token')
        return
    }

    await bot.sendMessage(MY_CHAT_ID, text);

    res.sendStatus(200);
    return;
})


app.listen(PORT, async () => {
    logger.info(`The server is running at http://localhost:${PORT}`);

});
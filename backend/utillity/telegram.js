import axios from 'axios';
import Parent from '../models/parent.js';

export const sendTelegramNotification = async (email, message) => {
    try {
        const token = process.env.TELEGRAM_BOT_TOKEN;
        if (!token) {
            console.log("Telegram token not set.");
            return;
        }

        // priority: 1. Parent's saved chat ID, 2. Env variable
        let chatId = process.env.TELEGRAM_CHAT_ID;

        if (email) {
            const parent = await Parent.findOne({ email });
            if (parent && parent.telegramChatId) {
                chatId = parent.telegramChatId;
            }
        }

        if (!chatId) {
            console.log("Telegram Chat ID not found for email:", email);
            return;
        }

        // console.log(`Sending Telegram message to ${chatId}: ${message}`); // Removed

        const url = `https://api.telegram.org/bot${token}/sendMessage`;
        await axios.post(url, {
            chat_id: chatId,
            text: message,
        });
        // console.log("Telegram notification sent successfully."); // Removed
    } catch (error) {
        console.error("Telegram Error:", error.message);
        if (error.response) {
            console.error("Response Data:", error.response.data);
            console.error("Response Status:", error.response.status);
        }
    }
};

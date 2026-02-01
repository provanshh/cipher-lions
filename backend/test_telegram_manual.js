import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

import { sendTelegramNotification } from './utillity/telegram.js';
import mongoose from 'mongoose';

const test = async () => {
    console.log("Testing Telegram Notification...");
    console.log("Token:", process.env.TELEGRAM_BOT_TOKEN ? "Loaded" : "Missing");
    console.log("Chat ID:", process.env.TELEGRAM_CHAT_ID);

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB (for Parent lookup check)");

        // Test with just Env Chat ID (passing null email)
        await sendTelegramNotification(null, "Test message from server script (Env ID)");

        // Test with email (if you want to test database lookup)
        // await sendTelegramNotification("vansh@example.com", "Test message from server script (DB lookup)");

        console.log("Done.");
        process.exit(0);
    } catch (err) {
        console.error("Test failed:", err);
        process.exit(1);
    }
};

test();

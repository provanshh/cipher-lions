import Child from "../models/child.js";
import Parent from "../models/parent.js";
import { sendTelegramNotification } from "./telegram.js";

// Check every 1 minute
const CHECK_INTERVAL = 60 * 1000;
// Consider offline if no heartbeat for 2 minutes
const HEARTBEAT_TIMEOUT = 2 * 60 * 1000;

export const startHeartbeatMonitor = () => {
    console.log("Starting Heartbeat Monitor...");

    setInterval(async () => {
        try {
            const now = new Date();
            const timeoutThreshold = new Date(now.getTime() - HEARTBEAT_TIMEOUT);

            // Find children who are marked online but haven't sent a heartbeat recently
            const offlineChildren = await Child.find({
                status: 'online',
                lastHeartbeat: { $lt: timeoutThreshold }
            });

            for (const child of offlineChildren) {
                console.log(`Child ${child.email} went offline. Last heartbeat: ${child.lastHeartbeat}`);

                // Mark as offline
                child.status = 'offline';
                await child.save();

                // Notify Parent
                const parent = await Parent.findOne({ children: child._id });
                if (parent) {
                    await sendTelegramNotification(parent.email, `Extension Disconnect: The extension for child ${child.name} has been disconnected (No heartbeat).`);
                }
            }

        } catch (err) {
            console.error("Heartbeat Monitor Error:", err);
        }
    }, CHECK_INTERVAL);
};

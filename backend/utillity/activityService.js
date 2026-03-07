import Log from "../models/log.js";
import Parent from "../models/parent.js";
import { sendTelegramNotification } from "./telegram.js";

/**
 * Centralized activity logger + Telegram notifier.
 *
 * This keeps the dashboard log and Telegram notifications in sync.
 * Use this instead of calling sendTelegramNotification or Log.create directly.
 */
export const logActivity = async ({
  child,
  parentEmail,
  type,
  domain,
  message,
}) => {
  try {
    // Persist to dashboard activity log
    if (child) {
      await Log.create({
        child,
        type,
        domain,
        message,
      });
    }
  } catch (err) {
    console.error("Activity log error:", err);
  }

  // Determine email to notify
  let emailToNotify = parentEmail;
  if (!emailToNotify && child) {
    try {
      const parent = await Parent.findOne({ children: child });
      if (parent) {
        emailToNotify = parent.email;
      }
    } catch (err) {
      console.error("ActivityService parent lookup error:", err);
    }
  }

  // Send Telegram notification (best effort)
  try {
    await sendTelegramNotification(emailToNotify || null, message);
  } catch (err) {
    console.error("ActivityService telegram error:", err);
  }
};


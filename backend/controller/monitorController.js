import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Child from "../models/child.js";
import parent from "../models/parent.js"
import Log from "../models/log.js";
import { sendTelegramNotification } from "../utillity/telegram.js";

export const monitorUrl = async (req, res) => {

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { email } = decoded;
    const { domain, category = "general", timeSpent = 60, searchQuery } = req.body;

    const child = await Child.findOne({ email });
    if (!child) return res.status(404).json({ message: "Child not found" });

    const today = new Date().toISOString().split("T")[0];
    const existingUrl = child.monitoredUrls.find(url => url.domain === domain);

    if (existingUrl) {
      const currentTime = existingUrl.dailyTimeSpent.get(today) || 0;
      existingUrl.dailyTimeSpent.set(today, currentTime + timeSpent);
      if (searchQuery && !existingUrl.searchQueries.includes(searchQuery)) {
        existingUrl.searchQueries.push(searchQuery);
      }
      existingUrl.lastUpdated = new Date();
    } else {
      child.monitoredUrls.push({
        domain,
        category,
        dailyTimeSpent: new Map([[today, timeSpent]]),
        searchQueries: searchQuery ? [searchQuery] : [],
        lastUpdated: new Date()
      });
    }

    // Update heartbeat
    child.lastHeartbeat = new Date();
    child.status = 'online';

    await child.save();

    if (searchQuery) {
      const parentDoc = await parent.findOne({ children: child._id });
      if (parentDoc) {
        await sendTelegramNotification(parentDoc.email, `Search Activity: Child ${child.name} searched for: "${searchQuery}" on ${domain}`);
      } else {
        await sendTelegramNotification(null, `Search Activity (Parent Unknown): Child ${child.name} searched for: "${searchQuery}" on ${domain}`);
      }
    }

    res.status(200).json({ message: "URL time updated successfully" });
  } catch (error) {
    console.error("Monitor URL Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const alertIncognito = async (req, res) => {
  const { url } = req.body;
  const email = req.user.email;

  if (!email || !url) {
    return res.status(400).json({ message: "Email and URL are required" });
  }

  try {
    const child = await Child.findOne({ email });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    const now = new Date();
    child.incognitoAlerts.push({ url, timestamp: now });
    await child.save();

    const parentDoc = await parent.findOne({ children: child._id });
    if (parentDoc) {
      await sendTelegramNotification(parentDoc.email, `Incognito Alert: Child ${child.name} accessed ${url} in incognito mode!`);
    } else {
      await sendTelegramNotification(null, `Incognito Alert (Parent Unknown): Child ${child.name} accessed ${url} in incognito mode!`);
    }

    res.status(200).json({ message: "Incognito alert stored" });

  } catch (err) {
    console.error("Error storing incognito alert:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const checkUrl = async (req, res) => {
  const { url } = req.body;
  const { email } = req.user;

  const child = await Child.findOne({ email });
  if (!child) return res.status(404).json({ blocked: false });
  const isBlocked = child.blockedUrls.some(blockedUrl => url.includes(blockedUrl));
  res.json({ blocked: isBlocked });
};

export const activateExtension = async (req, res) => {
  try {
    const { email } = req.user;
    const { password } = req.body;

    const child = await Child.findOne({ email });
    if (!child) return res.status(404).json({ message: "Child not found" });

    // Check for lockout
    if (child.lockoutUntil && child.lockoutUntil > new Date()) {
      return res.status(403).json({
        message: "Extension is locked due to multiple failed attempts",
        lockoutUntil: child.lockoutUntil
      });
    }

    const parentDoc = await parent.findOne({ children: child._id });
    if (!parentDoc) return res.status(404).json({ message: "Parent not found" });

    const validPassword = await bcrypt.compare(password, parentDoc.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid parent password" });
    }

    child.lastHeartbeat = new Date();
    child.status = 'online';
    await child.save();

    await sendTelegramNotification(
      parentDoc.email,
      `Extension Activation: The extension for child ${child.name} has been connected.`
    );

    res.status(200).json({ message: "Extension activated" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const disconnectExtension = async (req, res) => {
  try {
    const { email } = req.user;
    const { password } = req.body;

    const child = await Child.findOne({ email });
    if (!child) return res.status(404).json({ message: "Child not found" });

    // Check for lockout
    if (child.lockoutUntil && child.lockoutUntil > new Date()) {
      return res.status(403).json({
        message: "Extension is locked due to multiple failed attempts",
        lockoutUntil: child.lockoutUntil
      });
    }

    const parentDoc = await parent.findOne({ children: child._id });
    if (!parentDoc) return res.status(404).json({ message: "Parent not found" });

    const validPassword = await bcrypt.compare(password, parentDoc.password);
    if (!validPassword) {
      child.failedAttempts = (child.failedAttempts || 0) + 1;

      if (child.failedAttempts >= 3) {
        // Set lockout for 1 hour
        const lockoutTime = new Date(Date.now() + 60 * 60 * 1000);
        child.lockoutUntil = lockoutTime;
        child.failedAttempts = 0; // Reset after lockout
        await child.save();

        // Send Telegram notification
        const alertMsg = `SECURITY ALERT: Someone attempted to disconnect the extension for child ${child.name} with a WRONG PASSWORD 3 times. Extension is now locked for 1 hour.`;
        await sendTelegramNotification(parentDoc.email, alertMsg).catch(err => console.error("Telegram fail:", err));

        // Add to Dashboard logs
        await Log.create({
          child: child._id,
          type: 'SECURITY_ALERT',
          message: `Multiple failed disconnection attempts (3 trials). Extension locked until ${lockoutTime.toLocaleString()}.`
        }).catch(err => console.error("Log fail:", err));

        return res.status(403).json({
          message: "Too many failed attempts. Extension locked for 1 hour.",
          lockoutUntil: lockoutTime
        });
      } else {
        await child.save();
        return res.status(401).json({
          message: `Incorrect password. ${3 - child.failedAttempts} trials remaining.`,
          trialsRemaining: 3 - child.failedAttempts
        });
      }
    }

    // Success - Reset trials
    child.failedAttempts = 0;
    child.lockoutUntil = null;

    // Update status
    child.status = 'offline';
    await child.save();

    await sendTelegramNotification(
      parentDoc.email,
      `Extension Disconnect: The extension for child ${child.name} has been disconnected.`
    );

    res.status(200).json({ message: "Extension disconnected" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};



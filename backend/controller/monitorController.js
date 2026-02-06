// Called from extension to send current URL
import jwt from "jsonwebtoken";
import Child from "../models/child.js";
import parent from "../models/parent.js"
import { sendTelegramNotification } from "../utillity/telegram.js";

export const monitorUrl = async (req, res) => {
  console.log("request arrived");

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
    const child = await Child.findOne({ email });

    if (!child) return res.status(404).json({ message: "Child not found" });

    // Update status
    child.lastHeartbeat = new Date();
    child.status = 'online';
    await child.save();

    const parentDoc = await parent.findOne({ children: child._id });
    if (parentDoc) {
      await sendTelegramNotification(parentDoc.email, `Extension Activation: The extension for child ${child.name} has been connected.`);
    } else {
      await sendTelegramNotification(null, `Extension Activation (Parent Unknown): The extension for child ${child.name} has been connected.`);
    }

    res.status(200).json({ message: "Extension activated" });
  } catch (error) {
    console.error("Activation Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const disconnectExtension = async (req, res) => {
  try {
    const { email } = req.user;
    const child = await Child.findOne({ email });

    if (!child) return res.status(404).json({ message: "Child not found" });

    // Update status
    child.status = 'offline';
    await child.save();

    const parentDoc = await parent.findOne({ children: child._id });
    if (parentDoc) {
      await sendTelegramNotification(parentDoc.email, `Extension Disconnect: The extension for child ${child.name} has been disconnected.`);
    } else {
      await sendTelegramNotification(null, `Extension Disconnect (Parent Unknown): The extension for child ${child.name} has been disconnected.`);
    }

    res.status(200).json({ message: "Extension disconnected" });
  } catch (error) {
    console.error("Disconnect Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



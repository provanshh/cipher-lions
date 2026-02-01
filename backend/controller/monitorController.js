// Called from extension to send current URL
import jwt from "jsonwebtoken";
import Child from "../models/child.js";
import parent from "../models/parent.js"
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

    await child.save();
    res.status(200).json({ message: "URL time updated successfully" });
  } catch (error) {
    console.error("Monitor URL Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Called from extension when incognito detected without permission
// import Child from "../models/child.js";

export const alertIncognito = async (req, res) => {
  const { url } = req.body;
  const email = req.user.email
  // console.log(email)
  if (!email || !url) {
    return res.status(400).json({ message: "Email and URL are required" });
  }

  try {
    const child = await Child.findOne({ email });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const recentAlert = child.incognitoAlerts.find(alert =>
      alert.url === url && new Date(alert.timestamp) > fiveMinutesAgo
    );

    if (recentAlert) {
      return res.status(200).json({ message: "Duplicate alert skipped" });
    }

    child.incognitoAlerts.push({ url, timestamp: now });
    await child.save();

    // console.log("Incognito usage alert from:", child.email, "URL:", url);
    res.status(200).json({ message: "Incognito alert stored" });

  } catch (err) {
    console.error("Error storing incognito alert:", err);
    res.status(500).json({ message: "Server error" });
  }
};
export const checkUrl = async (req, res) => {
  const { url } = req.body;
  const { email } = req.user; // from token payload

  const child = await Child.findOne({ email });
  if (!child) return res.status(404).json({ blocked: false });
  const isBlocked = child.blockedUrls.some(blockedUrl => url.includes(blockedUrl));
  res.json({ blocked: isBlocked });
};



import path from "path";
import fs from "fs";
import SuperSafeSettings from "../models/superSafeSettings.js";
import AllowedSite from "../models/allowedSite.js";
import Parent from "../models/parent.js";
import Child from "../models/child.js";
import { sendTelegramNotification } from "../utillity/telegram.js";

const ensureSettings = async (parentId) => {
  let settings = await SuperSafeSettings.findOne({ parent: parentId });
  if (!settings) {
    settings = await SuperSafeSettings.create({ parent: parentId });
  }
  return settings;
};

export const getSettings = async (req, res) => {
  try {
    let parent = await Parent.findOne({ email: req.user.email });

    if (!parent) {
      const child = await Child.findOne({ email: req.user.email });
      if (child) {
        parent = await Parent.findOne({ children: child._id });
      }
    }

    if (!parent) return res.status(404).json({ message: "Parent not found" });
    const settings = await ensureSettings(parent._id);
    res.json({
      enabled: settings.enabled,
      blockExtensionsPage: settings.blockExtensionsPage,
      voiceMessageUrl: settings.voiceMessageUrl,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleSuperSafe = async (req, res) => {
  try {
    const { enabled } = req.body;
    const parent = await Parent.findOne({ email: req.user.email });
    if (!parent) return res.status(404).json({ message: "Parent not found" });
    const settings = await ensureSettings(parent._id);
    settings.enabled = !!enabled;
    await settings.save();

    const status = settings.enabled ? "enabled" : "disabled";
    const emoji = settings.enabled ? "🛡️" : "⚙️";
    await sendTelegramNotification(req.user.email, `${emoji} SuperSafe Mode ${status}`);

    res.json({ enabled: settings.enabled });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleBlockExtensionsPage = async (req, res) => {
  try {
    const { enabled } = req.body;
    const parent = await Parent.findOne({ email: req.user.email });
    if (!parent) return res.status(404).json({ message: "Parent not found" });
    const settings = await ensureSettings(parent._id);
    settings.blockExtensionsPage = !!enabled;
    await settings.save();

    const status = settings.blockExtensionsPage ? "enabled" : "disabled";
    await sendTelegramNotification(req.user.email, `🔧 Extensions page blocking ${status}`);

    res.json({ blockExtensionsPage: settings.blockExtensionsPage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllowedSites = async (req, res) => {
  try {
    const parent = await Parent.findOne({ email: req.user.email });
    if (!parent) return res.status(404).json({ message: "Parent not found" });
    const sites = await AllowedSite.find({ parent: parent._id }).sort({ createdAt: -1 });
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addAllowedSite = async (req, res) => {
  try {
    const { domain } = req.body;
    const parent = await Parent.findOne({ email: req.user.email });
    if (!parent) return res.status(404).json({ message: "Parent not found" });
    const normalized = domain.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
    const site = await AllowedSite.create({ parent: parent._id, domain: normalized });

    await sendTelegramNotification(req.user.email, `✅ SuperSafe: ${normalized} added to allowed sites`);

    res.status(201).json(site);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteAllowedSite = async (req, res) => {
  try {
    const parent = await Parent.findOne({ email: req.user.email });
    if (!parent) return res.status(404).json({ message: "Parent not found" });
    const site = await AllowedSite.findOne({ _id: req.params.id, parent: parent._id });
    const siteDomain = site?.domain || "unknown";
    await AllowedSite.deleteOne({ _id: req.params.id, parent: parent._id });

    await sendTelegramNotification(req.user.email, `🗑️ SuperSafe: ${siteDomain} removed from allowed sites`);

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// voice message upload: store locally under /uploads/supersafe
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "supersafe");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export const uploadVoiceMessage = async (req, res) => {
  try {
    const parent = await Parent.findOne({ email: req.user.email });
    if (!parent) return res.status(404).json({ message: "Parent not found" });
    const settings = await ensureSettings(parent._id);

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileName = `${parent._id}-${Date.now()}.webm`;
    const dest = path.join(UPLOAD_DIR, fileName);
    fs.writeFileSync(dest, req.file.buffer);

    settings.voiceMessageUrl = `/uploads/supersafe/${fileName}`;
    await settings.save();

    res.json({ voiceMessageUrl: settings.voiceMessageUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getVoiceMessage = async (req, res) => {
  try {
    const parent = await Parent.findOne({ email: req.user.email });
    if (!parent) return res.status(404).json({ message: "Parent not found" });
    const settings = await ensureSettings(parent._id);
    res.json({ voiceMessageUrl: settings.voiceMessageUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


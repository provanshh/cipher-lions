import express from "express";
import { monitorUrl, alertIncognito, checkUrl } from "../controller/monitorController.js";
import { verifyExtension } from "../middleware/extensionAuth.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/monitor-url", verifyToken, monitorUrl);
router.post("/incognito-alert", verifyToken, alertIncognito);
router.post("/check-url",verifyToken, checkUrl)
export default router;

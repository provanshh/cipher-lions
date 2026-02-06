import express from "express";
import { monitorUrl, alertIncognito, checkUrl, activateExtension, disconnectExtension } from "../controller/monitorController.js";
import { verifyExtension } from "../middleware/extensionAuth.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/monitor-url", verifyToken, monitorUrl);
router.post("/incognito-alert", verifyToken, alertIncognito);
router.post("/check-url", verifyToken, checkUrl);
router.post("/activate", verifyToken, activateExtension);
router.post("/disconnect", verifyToken, disconnectExtension);
export default router;

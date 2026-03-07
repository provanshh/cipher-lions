import express from "express";
import {
  monitorUrl,
  alertIncognito,
  alertBlockedSearch,
  checkUrl,
  activateExtension,
  disconnectExtension,
} from "../controller/monitorController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/monitor-url", verifyToken, monitorUrl);
router.post("/incognito-alert", verifyToken, alertIncognito);
router.post("/blocked-search", verifyToken, alertBlockedSearch);
router.post("/check-url", verifyToken, checkUrl);
router.post("/activate", verifyToken, activateExtension);
router.post("/disconnect", verifyToken, disconnectExtension);

export default router;

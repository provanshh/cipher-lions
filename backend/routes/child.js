import express from "express";
import { clearAlerts, createChild, getAlerts, getAlertsFull, getBlockedStats, getBlockedStatsFull, getChildren, getSearchActivities, getWebUsageStats, getWebUsageStatsFull } from "../controller/childController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-child", verifyToken, createChild);
router.get("/all", verifyToken, getChildren);
router.get("/web-usage/:email",getWebUsageStats)
router.get("/blocked/:email",getBlockedStats)
router.get("/alerts/:email",getAlerts)
router.get("/web-usagefull/:email",getWebUsageStatsFull)
router.get("/blockedfull/:email",getBlockedStatsFull)
router.get("/alertsfull/:email",getAlertsFull)
router.post("/web-usage-filtered",getSearchActivities)
router.delete("/delete-alerts/:email", clearAlerts)
// router.get("/testing",()=>{
//     console.log("testing child route")
// })

export default router;

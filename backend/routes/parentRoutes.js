import express from 'express';
import {
  getAllChildren,
  getChildDetails,
  getChildUrls,
  getChildAlerts,
  blockUrl,
  unblockUrl,
  resetTimeSpent
} from '../controller/parentContoller.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(verifyToken);
// router.post('/children', authMiddleware, createChild);
router.get('/children', getAllChildren);
router.get('/children/:id', getChildDetails);
router.get('/children/:id/urls', getChildUrls);
router.get('/children/:id/alerts', getChildAlerts);
router.post('/children/block', blockUrl);
// router.get('/children/block', ()=>{console.log("block hitted")});
router.post('/children/:id/unblock', unblockUrl);
router.post('/children/:id/reset', resetTimeSpent);

export default router;

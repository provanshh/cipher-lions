import express from "express";
import { register, login, getParent } from "../controller/authContoller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/signup", register);
router.post("/login", login);
router.post("/sync", (req, res) => {
  // Best-effort sync from frontend (Supabase handles user storage). Return 200 to avoid 404.
  res.status(200).json({ ok: true });
});
router.get("/user", verifyToken, getParent);

export default router;

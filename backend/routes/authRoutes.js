import express from "express";
import { register, login, changePassword, getParent } from "../controller/authContoller.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validateRequest.js";

const router = express.Router();
router.post("/signup", validate("signup"), register);
router.post("/login", validate("login"), login);
router.post("/sync", (req, res) => {
  // Best-effort sync from frontend (Supabase handles user storage). Return 200 to avoid 404.
  res.status(200).json({ ok: true });
});
router.put("/change-password", verifyToken, validate("changePassword"), changePassword);
router.get("/user", verifyToken, getParent);

export default router;

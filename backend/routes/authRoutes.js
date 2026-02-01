import express from "express";
import { register, login,getParent } from "../controller/authContoller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/signup", register);
router.post("/login", login);
router.get("/user",verifyToken,getParent)

export default router;

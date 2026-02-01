import Child from "../models/child.js";

import jwt from "jsonwebtoken";
// import Child from "../models/Child.js";

export const verifyExtension = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token missing or invalid" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const child = await Child.findOne({ email: decoded.email });

    if (!child) return res.status(403).json({ message: "Child not found" });

    req.user = child;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token", error: err.message });
  }
};


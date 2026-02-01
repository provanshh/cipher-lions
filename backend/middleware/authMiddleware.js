import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const verified = jwt.verify(token,process.env.JWT_SECRET);
    // console.log(verified);
    req.user = verified;
    next();
  } catch (err) {
    console.log(err)
    res.status(401).json({ message: "Invalid token" });
  }
};

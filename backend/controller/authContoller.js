import Parent from "../models/parent.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../utillity/jwt.js";

const JWT_SECRET = process.env.JWT_SECRET;

// Register
export const register = async (req, res) => {
  const {name, email, password } = req.body;

  try {
    const existing = await Parent.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    // const hashedPassword = await bcrypt.hash(password, 10);

    const parent = await Parent.create({
      name,
      email,
      password: password
    });
    const token = generateToken(email)


    res.status(201).json({ message: "Parent registered successfully", token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const parent = await Parent.findOne({ email });
    if (!parent) return res.status(404).json({ message: "User not found" });
const validPass=(password==parent.password)
    // const validPass = await bcrypt.compare(password, parent.password);
    // console.log(password," ", parent.password)
    if (!validPass) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(email)

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const getParent=async(req,res)=>{
  
  try {

  const email=req.user.email;
  const parent=await Parent.findOne({email})
     const { name } = parent;
    //  console.log(parent.email)
    //  console.log(parent.name)
    //  console.log(parent)

    res.json({ name, email });
  
} catch (error) 
{
  console.log(error)
  res.status(404).json({error})
  
}
}

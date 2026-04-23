import express from 'express';
import User from '../models/user.js';
import { protect } from '../middleware/auth.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if(!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const userExist = await User.findOne({email});
        if(userExist) {
            return res.status(400).json({ message: "User already exists" });
        } 

        const user = await User.create({ username, email, password });
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",    // important
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        
        res.status(201).json({ 
            id: user._id,
            username: user.username,
            email: user.email,
            token
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if(!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const user = await User.findOne({email});
        
        if(!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",    // important
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ 
            id: user._id,
            username: user.username, 
            email: user.email,
            token
        })
    }
    catch(error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,     // same as login
    sameSite: "None",   // same as login
    path: "/"          // VERY IMPORTANT
  });

  res.json({ message: "Logged out" });
});

router.get('/me', protect, async (req, res) => {
    res.status(200).json(req.user);
});

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});
}

export default router;
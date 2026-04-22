import User from '../models/user.js';
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    let token;
    // ✅ Check Authorization header FIRST
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }
    // ✅ Fallback to cookies
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
}
import rateLimit from "express-rate-limit";

export const requestLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts
    message: {
        success: false,
        message: "Too many requests. Try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
import express from 'express';
import User from '../models/user.js';
import protect from '../middleware/auth.middleware.js';
import verifyAdmin from '../middleware/admin.middleware.js'
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import transporter from '../config/mail.js'
import { requestLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const userExist = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (userExist) {
            if (userExist.email === email && userExist.username === username) {
                return res.status(400).json({
                    message: "Email and Username already exist"
                });
            }

            if (userExist.email === email) {
                return res.status(400).json({
                    message: "Email already registered"
                });
            }

            return res.status(400).json({
                message: "Username already taken"
            });
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
            role: user.role,
            token
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/login', requestLimiter, async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if ((!username && !email) || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const user = await User.findOne({
            $or: [
                { email },
                { username }
            ]
        });

        if (!user || !(await user.matchPassword(password))) {
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
            role: user.role,
            token
        })
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/logout", async (req, res) => {
    let token = req.cookies?.token || req.headers?.authorization?.split(" ")[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            await User.findByIdAndUpdate(decoded.id, { lastActive: new Date(Date.now() - 10 * 60 * 1000) });
        } catch (error) {
            // Ignore verification errors for logout
        }
    }

    res.clearCookie("token", {
        httpOnly: true,
        secure: true,     // same as login
        sameSite: "None",   // same as login
        path: "/"          // VERY IMPORTANT
    });

    res.json({ message: "Logged out" });
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Forgot password route hit");
        const userExist = await User.findOne({ email });
        console.log("User found:", !!userExist);

        if (!userExist) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Generate a random reset token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // Hash token and set to resetPasswordToken field
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        userExist.resetPasswordToken = resetPasswordToken;
        userExist.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

        await userExist.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const message = `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Please click the button below to reset your password.</p>
            <a href="${resetUrl}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p>This link will expire in 15 minutes.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
        `;

        try {
            await transporter.sendMail({
                from: `"Auth App" <${process.env.EMAIL_USER}>`,
                to: userExist.email,
                subject: "Password Reset Request",
                html: message
            });

            res.status(200).json({
                message: "Password reset link sent to email"
            });
        } catch (error) {
            userExist.resetPasswordToken = undefined;
            userExist.resetPasswordExpire = undefined;
            await userExist.save({ validateBeforeSave: false });

            return res.status(500).json({
                message: "Email could not be sent",
                error: error.message
            });
        }
    } catch (err) {
        console.error("Forgot Password Error:", err.message);
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
});

router.post('/reset-password/:token', async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token"
            });
        }

        const { password, confirmPassword } = req.body;

        if (!password || !confirmPassword) {
            return res.status(400).json({
                message: "Please provide password and confirmPassword"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Passwords do not match"
            });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            message: "Password reset successful"
        });
    } catch (error) {
        console.error("Reset Password Error:", error.message);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

router.get('/me', protect, async (req, res) => {
    res.status(200).json(req.user);
});

// Update user profile (username and email)
router.put('/update-profile', protect, async (req, res) => {
    try {
        const { username, email } = req.body;
        const userId = req.user._id;

        // Validate input
        if (!username && !email) {
            return res.status(400).json({
                message: "Please provide at least one field to update"
            });
        }

        // Check if username is already taken (by another user)
        if (username) {
            const existingUsername = await User.findOne({
                username,
                _id: { $ne: userId }
            });
            if (existingUsername) {
                return res.status(400).json({
                    message: "Username already taken"
                });
            }
        }

        // Check if email is already registered (by another user)
        if (email) {
            const existingEmail = await User.findOne({
                email,
                _id: { $ne: userId }
            });
            if (existingEmail) {
                return res.status(400).json({
                    message: "Email already registered"
                });
            }
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...(username && { username }),
                ...(email && { email })
            },
            { new: true }
        ).select('-password');

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server error"
        });
    }
});

router.get('/getAllUsers', protect, verifyAdmin, async (req, res) => {

    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const query = {};
        if (search) {
            query.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        const allUsers = await User.find(query)
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(200).json({
            message: "Users fetched successfully",
            allUsers,
            totalPages,
            currentPage: page,
            totalUsers
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

// Get single user by ID
router.get('/:id', protect, verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

// Update user role
router.put('/:id/role', protect, verifyAdmin, async (req, res) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            })
        }

        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "User role updated successfully",
            user
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

// Delete user
router.delete('/:id', protect, verifyAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "User deleted successfully",
            user
        })

    } catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
}

function generateOTP() {
    // 6-digits OTP
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
}

export default router;
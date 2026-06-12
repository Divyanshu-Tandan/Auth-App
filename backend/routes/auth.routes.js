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

router.post('/forgot-password/send-otp', requestLimiter, async (req, res) => {
    try {

        const { email } = req.body;
        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const otp = generateOTP();

        const hashedOTP = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        userExist.passwordResetOTP = hashedOTP;
        userExist.passwordResetExpires = Date.now() + 10 * 60 * 1000;

        await userExist.save();

        // Send email in the background (non-blocking)
        transporter.sendMail({
            from: `"Auth App" <${process.env.EMAIL_USER}>`,
            to: userExist.email,
            subject: "Password Reset OTP",
            html: `
                <h2>Password Reset</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>Expires in 10 minutes.</p>
            `
        }).catch(err => {
            console.error("Failed to send OTP email to", userExist.email, ":", err.message);
        });

        // Respond immediately (don't wait for email)
        res.status(201).json({
            message: "OTP sent successfully",
            userExist,
            otp: hashedOTP,
        });

    } catch (err) {
        console.error("OTP Send Error:", err.message);
        res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }

});

router.post('/forgot-password/verify-otp', async (req, res) => {
    try {

        const { email, otp } = req.body
        const hashedOTP = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        const user = await User.findOne({
            email: email,
            passwordResetOTP: hashedOTP,
            passwordResetExpires: { $gt: Date.now() }
        })

        if (!user) {
            return res.status(404).json({
                message: "Invalid OTP"
            })
        }

        res.status(200).json({
            message: "OTP Verified"
        })


    } catch (error) {
        return status(500).json({
            message: error.message || "Server Error"
        })
    }
})

router.post('/forgot-password/reset-password', async (req, res) => {
    try {

        const { email, otp, newPassword } = req.body;

        const hashedOTP = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        const user = await User.findOne({
            email: email,
            passwordResetOTP: hashedOTP,
            passwordResetExpires: {
                $gt: Date.now()
            }
        })

        if (!user) {
            return res.status(400).json({
                message: "Invalid OTP"
            })
        }

        user.password = newPassword;

        // invalidate OTP
        user.passwordResetOTP = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        res.status(200).json({
            message: "Password Updated Successfully"
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Server Error"
        })
    }
})

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
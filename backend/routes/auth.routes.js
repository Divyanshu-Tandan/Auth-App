import express from 'express';
import User from '../models/user.js';
import protect from '../middleware/auth.middleware.js';
import verifyAdmin from '../middleware/admin.middleware.js'
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import transporter from '../config/mail.js'

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if(!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const userExist = await User.findOne({
            $or: [
                {email}, 
                {username}
            ]
        });

        if(userExist) {
            if(userExist.email === email && userExist.username === username){
                return res.status(400).json({
                    message:"Email and Username already exist"
                });
            }

            if(userExist.email === email){
                return res.status(400).json({
                    message:"Email already registered"
                });
            }

            return res.status(400).json({
                message:"Username already taken"
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

router.post('/login', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if((!username && !email) || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const user = await User.findOne({
            $or: [
                {email},
                {username}
            ]
        });
        
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
            role: user.role,
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

router.post('/forgot-password/send-otp', async (req, res) => {
    try {

        const { email } = req.body;
        const userExist = await User.findOne({ email });

        if(!userExist) {
            return res.json({
                message: "If account exists OTP was sent"
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

        await transporter.sendMail({
            from: `"Auth App" <${process.env.EMAIL_USER}>`,
            to: userExist.email,
            subject: "Password Reset OTP",
            html: `
                <h2>Password Reset</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>Expires in 10 minutes.</p>
            `
        })

        res.status(201).json({
            message:"OTP sent successfully",
            userExist,
            otp: hashedOTP,
        });

    } catch(err) {
        res.status(500).json({
            message:"Server error"
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

        if(!user) {
            return res.status(404).json({
                message: "Invalid OTP"
            })
        }

        res.status(200).json({
            message: "OTP Verified"
        })


    } catch(error) {
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
            passwordResetExpires:{
                $gt:Date.now()
            }
        })

        if(!user) {
            return res.status(400).json({
                message: "Invalid OTP"
            })
        }

        user.password = newPassword;

        // invalidate OTP
        user.passwordResetOTP=undefined;
        user.passwordResetExpires=undefined;

        await user.save();

        res.status(200).json({
            message: "Password Updated Successfully"
        })

    } catch(error) {
        return res.status(500).json({
            message: error.message || "Server Error"
        })
    }
})

router.get('/me', protect, async (req, res) => {
    res.status(200).json(req.user);
});

router.get('/getAllUsers', protect, verifyAdmin, async (req, res) => {

    try {
        const allUsers = await User.find().select('-password')

        return res.status(200).json({
            message: "Users fetched successfully",
            allUsers
        })

    } catch(error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

// Get single user by ID
router.get('/:id', protect, verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user
        })

    } catch(error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

// Update user role
router.put('/:id/role', protect, verifyAdmin, async (req, res) => {
    try {
        const { role } = req.body;

        if(!['user', 'admin'].includes(role)) {
            return res.status(400).json({
                message: "Invalid role"
            })
        }

        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "User role updated successfully",
            user
        })

    } catch(error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

// Delete user
router.delete('/:id', protect, verifyAdmin, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "User deleted successfully",
            user
        })

    } catch(error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
})

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "30d"});
}

function generateOTP() {
    // 6-digits OTP
    return Math.floor(
    100000 + Math.random() * 900000
    ).toString();
}

export default router;
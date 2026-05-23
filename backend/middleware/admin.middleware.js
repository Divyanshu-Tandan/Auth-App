import User from '../models/user.js'
import jwt from 'jsonwebtoken'

const verifyAdmin = async (req, res, next) =>{
    try {
        if(req.user.role != 'admin') {
            return res.status(403).json({
                message: "Not authorized"
            })
        }
        next()
    } catch(error) {
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export default verifyAdmin
const jwt = require('jsonwebtoken')
const User = require('../models/user.model');

const protectRoute = async (req,res,next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({
                sucess: false,
                message: 'Unauthorized access' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(!decoded){
            return res.status(401).json({
                sucess: false,
                message: 'Unauthorized access' });
        }

        const user = await User.findById(decoded.id);
         
        if(!user){
            return res.status(401).json({
                sucess: false,
                message: 'Unauthorized access' });
        }
        req.user = {id: user._id.toString()};
        next();
        
    } catch (error) {
        console.error("Error in protectRoute middleware:", error);
        res.status(500).json({
            sucess: false,
            message: 'Server Error' });
    }
}

module.exports = protectRoute;
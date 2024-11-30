const jwt = require("jsonwebtoken");
const Devotee = require("../models/devotee");
const ExpressError = require("./ExpressError");

module.exports.verifyDevoteeToken = async( req, res, next )=> {
    const token = req.cookies.access_token ; 
    
    try {
        if(!token) {
            return res.status(401).json({ message : "Unauthorized request" });
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        const user = await Devotee.findById(decodedToken?._id).select("-password -refreshToken");
        
        if(!user) {
            return res.status(401).json({ message : "Invalid access token" });
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message : error?.message || "Invalid token." });
    }
}
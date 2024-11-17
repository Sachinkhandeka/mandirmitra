const jwt = require("jsonwebtoken");
const Devotee = require("../models/devotee");
const ExpressError = require("./ExpressError");

module.exports.verifyDevoteeToken = async( req, res, next )=> {
    try {
        const token = req.cookies.access_token ; 
    
        if(!token) {
            throw new ExpressError(401, "Unauthorized request");
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await Devotee.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!user) {
            throw new ExpressError(401, "Invalid access token");
        }
    
        req.user = user;
        next();
    } catch (error) {
        throw new ExpressError(401, error?.message || "Invalid access token");
    }
}
const jwt = require("jsonwebtoken");
const SuperAdmin = require("../models/superAdmin");
const User = require("../models/userSchema");
const Devotee = require("../models/devotee");

module.exports.verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message : "Unauthorized request" });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        let user;
        if (decodedToken.superAdmin) {
            // Check if the token is for a SuperAdmin
            user = await SuperAdmin.findById(decodedToken._id).select("-password -refreshToken");
        } else {
            // Otherwise, check if the token is for a User
            user = await User.findById(decodedToken._id).select("-password -refreshToken");
        }

        if (!user) {
            return res.status(401).json({ message : "Invalid token. User not found." })
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message : error?.message || "Invalid token." });
    }
};

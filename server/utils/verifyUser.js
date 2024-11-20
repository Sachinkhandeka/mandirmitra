const jwt = require("jsonwebtoken");
const ExpressError = require("./ExpressError");
const SuperAdmin = require("../models/superAdmin");
const User = require("../models/userSchema");

module.exports.verifyToken = async (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        throw new ExpressError(401, "Unauthorized request. Token not found.");
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
            throw new ExpressError(401, "Invalid token. User not found.");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ExpressError(401, error?.message || "Invalid token.");
    }
};

const jwt = require("jsonwebtoken");
const ExpressError = require("./ExpressError");
const SuperAdmin = require("../models/superAdmin");

module.exports.verifyAdmin = async (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        throw new ExpressError(401, "Unauthorized request. Token not found.");
    }

    try {
        // Verify the JWT token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Check if the user is a SuperAdmin
        if (!decodedToken.superAdmin) {
            throw new ExpressError(403, "Forbidden. Admin access only.");
        }

        // Fetch the SuperAdmin from the database
        const superAdmin = await SuperAdmin.findById(decodedToken._id).select("-password -refreshToken");

        if (!superAdmin) {
            throw new ExpressError(401, "Invalid token. Admin not found.");
        }

        req.user = superAdmin;
        next();
    } catch (error) {
        throw new ExpressError(401, error?.message || "Unauthorized request.");
    }
};

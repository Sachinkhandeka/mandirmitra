const jwt = require("jsonwebtoken");
const SuperAdmin = require("../models/superAdmin");

module.exports.verifyAdmin = async (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ message : "Unauthorized request" });
    }

    try {
        // Verify the JWT token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        // Check if the user is a SuperAdmin
        if (!decodedToken.superAdmin) {
            return res.status(403).json({ message : "Forbidden. Admin access only." });
        }

        // Fetch the SuperAdmin from the database
        const superAdmin = await SuperAdmin.findById(decodedToken._id).select("-password -refreshToken");
        if (!superAdmin) {
            return res.status(401).json({ message : "Invalid token. Admin not found." });
        }

        req.user = superAdmin;
        next();
    } catch (error) {
        res.status(401).json({ message : error?.message });
    }
};

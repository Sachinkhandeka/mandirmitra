const jwt = require("jsonwebtoken");
const ExpressError = require("./ExpressError");

module.exports.verifyReadPermission = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message : "Unauthorized request. Token not found." });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Check if the user is a SuperAdmin
        if (decodedToken.superAdmin) {
            req.user = decodedToken;
            return next(); // SuperAdmins have full access
        }

        // Check if the user has 'read' permission
        if (!decodedToken.permissions.includes("read")) {
            return res.status(403).json({ message : "You do not have permission to read." });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ message : error?.message || "Invalid token." });
    }
};

module.exports.verifyCreatePermission = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message : "Unauthorized request. Token not found." });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Check if the user is a SuperAdmin
        if (decodedToken.superAdmin) {
            req.user = decodedToken;
            return next(); // SuperAdmins have full access
        }

        // Check if the user has 'create' permission
        if (!decodedToken.permissions.includes("create")) {
            return res.status(403).json({ message : "You do not have permission to create." });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ message : error?.message || "Invalid token." });
    }
};

module.exports.verifyUpdatePermission = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message : "Unauthorized request. Token not found." });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Check if the user is a SuperAdmin
        if (decodedToken.superAdmin) {
            req.user = decodedToken;
            return next(); // SuperAdmins have full access
        }

        // Check if the user has 'update' permission
        if (!decodedToken.permissions.includes("update")) {
            return res.status(403).json({ message : "You do not have permission to update." });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ message : error?.message || "Invalid token." });
    }
};

module.exports.verifyDeletePermission = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message : "Unauthorized request. Token not found." });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Check if the user is a SuperAdmin
        if (decodedToken.superAdmin) {
            req.user = decodedToken;
            return next(); // SuperAdmins have full access
        }

        // Check if the user has 'delete' permission
        if (!decodedToken.permissions.includes("delete")) {
            return res.status(403).json({ message : "You do not have permission to delete." });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({ message : error?.message || "Invalid token." });
    }
};

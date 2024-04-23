const jwt  = require("jsonwebtoken");
const ExpressError = require("./ExpressError");
const secret = process.env.JWT_SECRET ; 

module.exports.verifyReadPermission = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        throw new ExpressError(401, "Unauthorized.");
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            throw new ExpressError(401, "Unauthorized.");
        }

        // Check if the user is a superAdmin
        if (user.superAdmin) {
            req.user = user ;
            return next(); // Allow access for superAdmin
        }

        // Check if the user has read permission
        if (!user.permissions.includes("read")) {
            throw new ExpressError(401, "You do not have permission to read.");
        }

        req.user = user;
        next();
    });
}

module.exports.verifyCreatePermission = (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
        throw new ExpressError(401, "Unauthorized.");
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            throw new ExpressError(401, "Unauthorized.");
        }

        // Check if the user is a superAdmin
        if (user.superAdmin) {
            req.user = user;
            return next(); // Allow access for superAdmin
        }

        // Check if the user has create permission
        if (!user.permissions.includes("create")) {
            throw new ExpressError(401, "You do not have permission to create.");
        }

        req.user = user;
        next();
    });
}

module.exports.verifyUpdatePermission = (req, res, next) => {
    const token  = req.cookies.access_token; 

    if(!token) {
        throw new ExpressError(401 , "Unauthorized.");
    }

    jwt.verify(token, secret, (err, user)=> {
        if(err) {
            throw new ExpressError(401, "Unauthorized.");
        }

         // Check if the user is a superAdmin
         if (user.superAdmin) {
            req.user = user;
            return next(); // Allow access for superAdmin
        }

        // Check if the user has create permission
        if (!user.permissions.includes("update")) {
            throw new ExpressError(401, "You do not have permission to update.");
        }

        req.user = user;
        next();
    });

}

module.exports.verifyDeletePermission = (req, res, next) => {
    const token  = req.cookies.access_token; 

    if(!token) {
        throw new ExpressError(401 , "Unauthorized.");
    }

    jwt.verify(token, secret, (err, user)=> {
        if(err) {
            throw new ExpressError(401, "Unauthorized.");
        }

         // Check if the user is a superAdmin
         if (user.superAdmin) {
            req.user = user;
            return next(); // Allow access for superAdmin
        }

        // Check if the user has create permission
        if (!user.permissions.includes("delete")) {
            throw new ExpressError(401, "You do not have permission to delete.");
        }

        req.user = user;
        next();
    });

}
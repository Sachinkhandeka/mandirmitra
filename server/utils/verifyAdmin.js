const jwt  = require("jsonwebtoken");
const ExpressError = require("./ExpressError");
const secret = process.env.JWT_SECRET ; 

module.exports.verifyAdmin = ( req ,res , next )=> {
    const token = req.cookies.access_token ; 

    if(!token) {
        throw new ExpressError(401 , "Unauthorized request.");
    }

    jwt.verify(token , secret , (err , user)=> {
        if(err) {
            throw new ExpressError(401 , "Unauthorized request.");
        }
        if(!user.superAdmin) {
            throw new ExpressError(401 , "You are not allowed to perform this task.");
        }
        req.user = user ; 
        next();
    });
}
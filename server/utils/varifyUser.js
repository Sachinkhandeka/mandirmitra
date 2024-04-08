const jwt = require("jsonwebtoken");
const ExpressError = require("./ExpressError");
const secret = process.env.JWT_SECRET ; 

module.exports.varifyToken = (req ,res , next)=> {
    const token = req.cookies.access_token ; 
    if(!token) {
        throw new ExpressError(401 , "Unauthorized.");
    }

    jwt.verify(token , secret , (err , user)=> {
        if(err) {
            throw new ExpressError(401, "Unauthorized.");
        }
        req.user = user ;
        next();
    });
}
const User = require("../models/userSchema");
const ExpressError = require("../utils/ExpressError");
const bcryptjs = require("bcryptjs");
const salt = 10 ; 

//create user route  handler 
module.exports.createController = async(req ,res)=> {
    const user = req.user ; 
    const formData = req.body ; 
    const templeId = req.params.templeId ; 

    if(!user) {
        throw new ExpressError(400 , "permission not granted.");
    }

    if(!formData.username || !formData.email || !formData.password || !Array.isArray(formData.roles)) {
        throw new ExpressError(400 , "Invalid data formate.");
    }
    if(!templeId) {
        throw new ExpressError(400 , "permission not granted.");
    }

    const hashPass = bcryptjs.hashSync(formData.password , salt);

    const newUser = new User({
        username : formData.username,
        email : formData.email,
        password : hashPass,
        roles : formData.roles,
        templeId : templeId ,
    });

    await newUser.save();
    res.status(200).json("New user created successfully.");
}
const User = require("../models/userSchema");

//signup route handler
module.exports.signupController = async(req ,res)=> {
    console.log("signup route");
    res.send("user signup route");
}
const User = require("../models/userSchema");
const ExpressError = require("../utils/ExpressError");
//get roles route  handler 
module.exports.createController = async(req ,res)=> {
    const user = req.user ; 
    const {formData, actions } = req.body ; 
    const templeId = req.params.templeId ; 
    
    if(!user) {
        throw new ExpressError(400 , "permission not granted.");
    }

    if(!formData.username || !formData.email || !formData.password || !Array.isArray(actions)) {
        throw new ExpressError(400 , "Invalid data formate.");
    }
    if(!templeId) {
        throw new ExpressError(400 , "permission not granted.");
    }
}
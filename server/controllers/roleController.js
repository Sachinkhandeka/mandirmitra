const Role = require("../models/roleSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.createController = async(req ,res)=> {
    const user = req.user ; 
    const  { name , permissions } = req.body ; 

    if(!user) {
        throw new ExpressError(401 , "Forbiden");
    }

    const role = new Role({ name , permissions });
    
}
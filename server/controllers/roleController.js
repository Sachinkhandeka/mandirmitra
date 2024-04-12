const Role = require("../models/roleSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.createController = async(req ,res)=> {
    const user = req.user ; 
    const formData  = req.body ; 
    const templeId = req.params.templeId ; 

    if(!formData.name || !formData.permissions || !Array.isArray(formData.permissions)) {
        throw new ExpressError(400 , "Invalid data formate.");
    }
    // Create a new role
    const newRole = new Role({
        name: formData.name,
        permissions: formData.permissions,
        templeId :  templeId,
    });

    await newRole.save();
    res.status(200).json("New role created successfully.");
    
}
const { model } = require("mongoose");
const Role = require("../models/roleSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.createController = async(req ,res)=> {
    const user = req.user ; 
    const formData  = req.body ; 
    const templeId = req.params.templeId ; 

    if(!user) {
        throw new ExpressError(400 , "permission not granted.");
    }

    if(!formData.name || !formData.permissions || !templeId || !Array.isArray(formData.permissions)) {
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

//get  roles route handler
module.exports.getController = async(req ,res)=> {
    const templeId = req.params.templeId ; 
    const user = req.user ; 

    if(!templeId) {
        throw new ExpressError("Cannot found valid roles for this templeId.");
    }
    if(!user) {
        throw new ExpressError(403 , "Forbiden.");
    }

    const roles = await Role.find({ templeId }).populate(
        {
            "path" : "roles",
            populate : {
                path : "permissions",
                model : "Permission",
            }
        }
    );

    res.status(200).json({
        roles,
    });
}
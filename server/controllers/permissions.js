const Permission = require("../models/permissionSchema");
const ExpressError = require("../utils/ExpressError");

//create permissions route  handler 
module.exports.createController = async(req ,res)=> {
    const user = req.user ; 
    const { permissionName , actions , templeId } = req.body ; 
    
    if(!user) {
        throw new ExpressError(403 , "Forbiden");
    }

    const newPermission = new Permission({permissionName , actions, templeId});
    
    await newPermission.save();
    res.status(200).json("Permission created successfully.");
}
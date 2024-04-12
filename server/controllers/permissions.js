const Permission = require("../models/permissionSchema");
const ExpressError = require("../utils/ExpressError");

//create permissions route  handler 
module.exports.createController = async(req ,res)=> {
    const user = req.user ; 
    const { permissionName , actions , templeId } = req.body ;
    
    if(!permissionName || !actions || !templeId) {
        throw new ExpressError(400 , "Please provide all the fields.");
    }

    if(!user) {
        throw new ExpressError(403 , "Forbiden");
    }

    const newPermission = new Permission({permissionName , actions, templeId});
    
    await newPermission.save();
    res.status(200).json("Permission created successfully.");
}

module.exports.getController = async(req ,res)=> {
    const templeId = req.params.templeId ; 
    const user = req.user ; 

    if(!templeId) {
        throw new ExpressError("Cannot found valid permissions for this templeId.");
    }
    if(!user) {
        throw new ExpressError(403 , "Forbiden.");
    }

    const permissions = await Permission.find({ templeId });

    res.status(200).json({
        permissions,
    });
}
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

//get permissions route handler
module.exports.getController = async(req ,res)=> {
    const templeId = req.params.templeId ; 
    const user = req.user ; 

    if(!templeId) {
        throw new ExpressError( 403, "Cannot found valid permissions for this templeId.");
    }
    if(!user) {
        throw new ExpressError(403 , "Forbiden.");
    }

    const permissions = await Permission.find({ templeId });

    res.status(200).json({
        permissions,
    });
}

//edit permission route handler
module.exports.editController = async(req ,res)=> {
    const user = req.user ; 
    const permissionId = req.params.permissionId ; 
    const formData = req.body ; 

    const permissionToUpdate = await Permission.findById(permissionId);

    if(!user.superAdmin) {
        throw new ExpressError(403 , "Permission not granted.");
    }

    if(!permissionToUpdate) {
        throw new ExpressError(404 , "Permission not found.");
    }

    if(formData) {
        if(!formData.permissionName) {
            throw new ExpressError(400 , "Permission name not found.");
        }
        if(!formData.actions) {
            throw new ExpressError(400 , "Actions can't be empty.");
        }
    }

    await Permission.findByIdAndUpdate(permissionId , formData , { new : true });

    res.status(200).json({
        message : "Permission updated successfully.",
    });

}
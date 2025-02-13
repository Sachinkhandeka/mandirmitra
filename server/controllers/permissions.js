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
    const { templeId, permissionId } = req.params; 
    const formData = req.body ; 

    const permissionToUpdate = await Permission.findOne({ _id:permissionId, templeId : templeId });

    if(!user) {
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

    await Permission.findOneAndUpdate({_id : permissionId, templeId : templeId} , formData , { new : true });

    res.status(200).json({
        message : "Permission updated successfully.",
    });

}

//delete permission route handler
module.exports.deleteController = async(req ,res)=> {
    const user = req.user ; 
    const { templeId ,  permissionId } = req.params; 
    
    const permissionToDelete = await Permission.findOne({ _id: permissionId , templeId : templeId });

    if(!user) {
        throw new ExpressError(400 , "Permission not granted.");
    }

    if(!permissionToDelete) {
        throw new ExpressError(400 , "Permission not found.");
    }

    await Permission.findOneAndDelete({ _id: permissionId , templeId : templeId });

    res.status(200).json("Permission deleted successfully.");
}
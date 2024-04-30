const { json } = require("express");
const Temple = require("../models/temple");
const ExpressError = require("../utils/ExpressError");

module.exports.addController = async(req ,res)=> {
    const { name, location } = req.body;

    if (!name || !location) { 
        throw new ExpressError(400, "Please provide all the details.");
    }

    let newTemple = await Temple.create({ name, location });

    newTemple = await newTemple.save();

    res.status(200).json({
        temple : newTemple
    });
}  

module.exports.getController = async(req , res)=> {
    const { user } = req ; 
    const templeId = req.params.templeId ; 

    if(!user) {
        throw new ExpressError(400, "Unothorized.");
    }

    if(!templeId) {
        throw new ExpressError(400 , "Temple id not found.");
    }

    const temple = await Temple.findById(templeId);

    res.status(200).json({temple});

}
const Seva = require("../models/sevaSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.create = async(req ,res)=> {
    const {  templeId } = req.params ; 
    const seva = req.body.seva ; 

    if(!templeId) {
        throw new ExpressError("Temple id required.");
    }

    if(!seva) {
        throw new ExpressError(400, "Invalid data formate.");
    }

    const isSeva = await Seva.find({ temple : templeId, sevaName : seva });

    if(isSeva.length > 0) {
        throw new ExpressError(400, "Seva already exists.");
    }

    const newSeva = new Seva({
        temple : templeId,
        sevaName : seva,
    });

    await newSeva.save();

    res.status(200).json({message : "Seva Created Successfully."});
}

module.exports.getSeva = async(req, res)=> {
    const { templeId } = req.params ; 

    const searchCriteria = {
        temple : templeId,
    }

    const seva = await Seva.find(searchCriteria);

    res.status(200).json({ seva });
}
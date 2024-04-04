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
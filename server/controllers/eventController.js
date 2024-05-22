const Event = require("../models/eventSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.create = async(req , res)=> {
    const eventData = req.body ;  
    const templeId = req.params.templeId ; 
    
    if(!eventData) {
        throw new ExpressError(400, "Event rata required.");
    }

    if(!templeId) {
        throw new ExpressError(400, "Temple not found.");
    }

    const newEvent = new Event({
        name : eventData.name,
        date : eventData.date,
        location : eventData.location,
        status : eventData.status,
        temple : templeId,
    });

    await newEvent.save();
    
    res.status(200).json({
        message : "Event created successfully",
    });
}

module.exports.getEvents = async(req ,res)=> {
    const templeId = req.params.templeId ; 

    if(!templeId) {
        throw new ExpressError(404, "Temple not found.");
    }

    const events = await Event.find({ temple : templeId });

    res.status(200).json({
        events,
    });
}
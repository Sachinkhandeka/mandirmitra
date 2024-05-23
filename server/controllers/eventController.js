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

module.exports.editEvent = async (req, res) => {
    const { id, templeId } = req.params;
    const eventData = req.body;

    if (!id) {
        throw new ExpressError(400, "Event ID required.");
    }

    if (!templeId) {
        throw new ExpressError(400, "Temple ID required.");
    }

    if (!eventData) {
        throw new ExpressError(400, "Event data required.");
    }
    const event = await Event.findOne({ _id: id, temple: templeId });

    if (!event) {
        throw new ExpressError(404, "Event not found.");
    }

    // Update only the fields that have changed
    const updates = {};
    if (eventData.name && eventData.name !== event.name) {
        updates.name = eventData.name;
    }
    if (eventData.date && eventData.date !== event.date) {
        updates.date = eventData.date;
    }
    if (eventData.location && eventData.location !== event.location) {
        updates.location = eventData.location;
    }
    if (eventData.status && eventData.status !== event.status) {
        updates.status = eventData.status;
    }

    if (Object.keys(updates).length > 0) {
        await Event.updateOne({ _id: id, temple: templeId }, { $set: updates });
    }

    res.status(200).json({
        message: "Event updated successfully",
    });
};

module.exports.deleteEvent = async (req, res) => {
    const { id, templeId } = req.params;

    if (!id) {
        throw new ExpressError(400, "Event ID required.");
    }

    if (!templeId) {
        throw new ExpressError(400, "Temple ID required.");
    }

    const event = await Event.findOne({ _id: id, temple: templeId });

    if (!event) {
        throw new ExpressError(404, "Event not found.");
    }

    await Event.deleteOne({ _id: id, temple: templeId });

    res.status(200).json({
        message: "Event deleted successfully",
    });
};

const mongoose = require('mongoose');
const Invitation = require('../models/invitationSchema');
const Temple = require('../models/temple'); 
const Event = require('../models/eventSchema'); 
const ExpressError = require('../utils/ExpressError');

module.exports.save = async (req, res, next) => {
    const { templeId, eventId } = req.params;
    const invitation = req.body;

    // Check if templeId and eventId are valid MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(templeId)) {
        throw new ExpressError('Invalid Temple ID', 400);
    }
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new ExpressError('Invalid Event ID', 400);
    }

    // Check if the temple exists
    const temple = await Temple.findById(templeId);
    if (!temple) {
        throw new ExpressError('Temple not found', 404);
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
        throw new ExpressError('Event not found', 404);
    }

    // Check if the invitation already exists for the donor and event
    const existingInvitation = await Invitation.findOne(
        { 
            donorName: invitation.donorName,
            passCode: invitation.passCode, 
            event: eventId 
        }
    );
    if (existingInvitation) {
        return res.status(200).json({ message: 'Invitation for this donor and event already exists' });
    }

    // Save the new invitation
    const newInvitation = new Invitation({
        ...invitation,
        temple: templeId,
        event: eventId
    });
    await newInvitation.save();

    res.status(201).json({ message: 'Invitation saved successfully.' });
};

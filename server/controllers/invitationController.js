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
        throw new ExpressError(400, 'Invalid Temple ID');
    }
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new ExpressError(400, 'Invalid Event ID');
    }

    // Check if the temple exists
    const temple = await Temple.findById(templeId);
    if (!temple) {
        throw new ExpressError(404, 'Temple not found');
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
        throw new ExpressError(404, 'Event not found' );
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

module.exports.getInvitations = async(req ,res)=> {
    const { templeId, eventId } = req.params;
    const { searchTerm } = req.query;

    // Check if templeId and eventId are valid MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(templeId)) {
        throw new ExpressError(400, 'Invalid Temple ID');
    }
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new ExpressError(400, 'Invalid Event ID');
    }

    // Check if the temple exists
    const temple = await Temple.findById(templeId);
    if (!temple) {
        throw new ExpressError(404, 'Temple not found');
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
        throw new ExpressError(404, 'Event not found');
    }

    // Build the query object
    const query = { temple: templeId, event: eventId };

    // Add searchTerm filtering
    if (searchTerm) {
        query.$or = [
            { passCode: { $regex: searchTerm, $options: 'i' } },
            { donorName: { $regex: searchTerm, $options: 'i' } }
        ];
    }

    // Get invitations
    const guests = await Invitation.find(query).populate('event');

    if(!guests) {
        throw new ExpressError(400, "Guests not found.");
    }

    res.status(200).json({ guests });
}

module.exports.editInvitation = async (req, res) => {
    const { templeId, eventId } = req.params;
    const { guestId, attended } = req.body;

    const invitation = await Invitation.findOneAndUpdate(
        { _id: guestId, temple: templeId, event: eventId },
        { attended },
        { new: true }
    );

    if (!invitation) {
        throw new ExpressError(404 ,"Invitation not found");
    }

    res.status(200).json({ message: "Invitation updated successfully", invitation });
};

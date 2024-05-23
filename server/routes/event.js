const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const event = require('../controllers/eventController');
const { verifyCreatePermission, verifyReadPermission, verifyUpdatePermission, verifyDeletePermission } = require('../utils/verifyPermissions');
const { validateEventSchema } = require('../middleware');

// Create event route
router.post(
    "/create/:templeId",
    verifyCreatePermission,
    validateEventSchema,
    wrapAsync(event.create), 
);

//get events
router.get(
    "/get/:templeId",
    verifyReadPermission,
    wrapAsync(event.getEvents),
);

//edit event
router.put(
    "/edit/:id/:templeId",
    verifyUpdatePermission,
    validateEventSchema,
    wrapAsync(event.editEvent),
);

//delete evwnt
router.delete(
    "/delete/:id/:templeId",
    verifyDeletePermission,
    wrapAsync(event.deleteEvent),
);

module.exports = router;
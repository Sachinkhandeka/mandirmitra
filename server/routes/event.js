const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const event = require('../controllers/eventController');
const { verifyCreatePermission, verifyReadPermission } = require('../utils/verifyPermissions');
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

module.exports = router;
const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync");
const invitation = require("../controllers/invitationController");
const { validateInvitationSchema } = require("../middleware");

router.post(
    "/save/:templeId/:eventId",
    validateInvitationSchema,
    wrapAsync(invitation.save),
);

router.get(
    "/get/:templeId/:eventId",
    wrapAsync(invitation.getInvitations),
);

router.put(
    "/edit/:templeId/:eventId",
    wrapAsync(invitation.editInvitation)
);
module.exports = router ; 
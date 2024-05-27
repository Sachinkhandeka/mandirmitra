const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const invitation = require("../controllers/invitationController");
const { validateInvitationSchema } = require("../middleware");

router.post(
    "/save/:templeId/:eventId",
    validateInvitationSchema,
    wrapAsync(invitation.save),
);

module.exports = router ; 
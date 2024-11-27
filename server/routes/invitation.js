const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync");
const invitation = require("../controllers/invitationController");
const { validateInvitationSchema } = require("../middleware");
const { verifyCreatePermission, verifyReadPermission, verifyUpdatePermission, verifyDeletePermission } = require("../utils/verifyPermissions");

router.post(
    "/save/:templeId/:eventId",
    verifyCreatePermission,
    validateInvitationSchema,
    wrapAsync(invitation.save),
);

router.get(
    "/get/:templeId/:eventId",
    verifyReadPermission,
    wrapAsync(invitation.getInvitations),
);

router.put(
    "/edit/:templeId/:eventId",
    verifyUpdatePermission,
    wrapAsync(invitation.editInvitation)
);
module.exports = router ; 
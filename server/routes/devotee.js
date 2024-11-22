const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync");
const { validateDevoteeSchema } = require("../middleware");
const devotees = require("../controllers/devoteeController");
const { verifyDevoteeToken } = require("../utils/verifyDevotee");

//login
router.post(
    "/auth",
    wrapAsync(devotees.devoteeAuthController),
);

//signup or create
router.post(
    "/create",
    validateDevoteeSchema,
    wrapAsync(devotees.devoteeCreateController),
);

router.put(
    "/:devoteeId",
    verifyDevoteeToken,
    wrapAsync(devotees.editDevoteeProfileController),
);

router.put(
    "/:devoteeId/password",
    verifyDevoteeToken,
    wrapAsync(devotees.updatePasswordController),
);

router.post(
    "/signout",
    verifyDevoteeToken,
    wrapAsync(devotees.signOutController),
);
router.post(
    "/refresh-token",
    wrapAsync(devotees.refreshTokenController),
);

module.exports = router ; 
const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync");
const { verifyToken } = require("../utils/verifyUser");
const { validateDevoteeSchema } = require("../middleware");
const devotees = require("../controllers/devoteeController");

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
    verifyToken,
    wrapAsync(devotees.editDevoteeProfileController),
);

router.put(
    "/:devoteeId/password",
    verifyToken,
    wrapAsync(devotees.updatePasswordController),
);

router.post(
    "/signout",
    wrapAsync(devotees.signOutController),
);

module.exports = router ; 
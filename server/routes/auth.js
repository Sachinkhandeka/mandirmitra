const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync");
const auth = require("../controllers/authController");

//forgot-password
router.post(
    "/forgot-password",
    wrapAsync(auth.forgotPasswordController),
);

//re-set-password
router.post(
    "/reset-password/:token",
    wrapAsync(auth.resetPasswordController),
);

module.exports = router;
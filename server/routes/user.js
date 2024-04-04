const express = require("express");
const router = express.Router({ mergeParams : true });
const user = require("../controllers/userController");
const wrapAsync = require("../utils/wrapAsync");

//signup route
router.post(
    "/post",
    wrapAsync(user.signupController),
);

module.exports = router ; 
const express = require("express");
const router = express.Router({ mergeParams : true });
const user = require("../controllers/userController");
const wrapAsync = require("../utils/wrapAsync");
const { verifyAdmin } = require("../utils/verifyAdmin");

//signup route
router.post(
    "/create/:templeId",
    verifyAdmin,
    wrapAsync(user.createController),
);

module.exports = router ; 
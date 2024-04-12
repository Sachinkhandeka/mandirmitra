const express = require("express");
const router = express.Router({ mergeParams : true });
const user = require("../controllers/userController");
const wrapAsync = require("../utils/wrapAsync");
const { verifyAdmin } = require("../utils/verifyAdmin");

//create route
router.post(
    "/create/:templeId",
    verifyAdmin,
    wrapAsync(user.createController),
);

//get route
router.get(
    "/get/:templeId",
    verifyAdmin,
    wrapAsync(user.getController),
);

module.exports = router ; 
const express = require("express");
const router = express.Router();
const role = require("../controllers/roleController");
const wrapAsync = require("../utils/wrapAsync");
const { verifyAdmin } = require("../utils/verifyAdmin");

router.post(
    "/create/:templeId",
    verifyAdmin,
    wrapAsync(role.createController),
);

router.get(
    "/get/:templeId",
    verifyAdmin,
    wrapAsync(role.getController),
);

module.exports = router ; 
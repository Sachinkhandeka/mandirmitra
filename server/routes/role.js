const express = require("express");
const router = express.Router();
const role = require("../controllers/roleController");
const wrapAsync = require("../utils/wrapAsync");
const { verifyAdmin } = require("../utils/verifyAdmin");

router.post(
    "/create",
    verifyAdmin,
    wrapAsync(role.createController),
);

module.exports = router ; 
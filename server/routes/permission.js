const express = require("express");
const router = express.Router();
const permission = require("../controllers/permissions");
const wrapAsync = require("../utils/wrapAsync");
const { verifyAdmin } = require("../utils/verifyAdmin");


//create permissions route
router.post(
    "/create",
    verifyAdmin,
    wrapAsync(permission.createController),
);

module.exports = router ; 

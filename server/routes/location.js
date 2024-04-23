const express = require("express");
const  router = express.Router({ mergeParams : true });
const location = require("../controllers/LocationController");
const wrapAsyn = require("../utils/wrapAsync");
const { verifyCreatePermission } = require("../utils/verifyPermissions");

//add location 
router.post(
    "/add",
    verifyCreatePermission,
    wrapAsyn(location.addController),
);

module.exports = router; 
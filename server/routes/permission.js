const express = require("express");
const router = express.Router({ mergeParams : true });
const permission = require("../controllers/permissions");
const wrapAsync = require("../utils/wrapAsync");
const { verifyAdmin } = require("../utils/verifyAdmin");


//create permissions route
router.post(
    "/create",
    verifyAdmin,
    wrapAsync(permission.createController),
);

//get route
router.get(
    "/get/:templeId",
    verifyAdmin,
    wrapAsync(permission.getController),
);

//edit route
router.put(
    "/edit/:permissionId",
    verifyAdmin,
    wrapAsync(permission.editController),
);

module.exports = router ; 

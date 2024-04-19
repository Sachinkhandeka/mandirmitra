const express = require("express");
const router = express.Router();
const role = require("../controllers/roleController");
const wrapAsync = require("../utils/wrapAsync");
const { verifyAdmin } = require("../utils/verifyAdmin");

//create role
router.post(
    "/create/:templeId",
    verifyAdmin,
    wrapAsync(role.createController),
);

//get roles
router.get(
    "/get/:templeId",
    verifyAdmin,
    wrapAsync(role.getController),
);

//edit role
router.put(
    "/edit/:roleId",
    verifyAdmin,
    wrapAsync(role.editController),
);

//delete role
router.delete(
    "/delete/:roleId",
    verifyAdmin,
    wrapAsync(role.deleteController),
);

module.exports = router ; 
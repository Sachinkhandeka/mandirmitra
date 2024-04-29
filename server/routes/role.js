const express = require("express");
const router = express.Router();
const role = require("../controllers/roleController");
const wrapAsync = require("../utils/wrapAsync");
const { verifyAdmin } = require("../utils/verifyAdmin");
const { validateRoleSchema } = require("../middleware");

//create role
router.post(
    "/create/:templeId",
    verifyAdmin,
    validateRoleSchema,
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
    "/edit/:templeId/:roleId",
    verifyAdmin,
    validateRoleSchema,
    wrapAsync(role.editController),
);

//delete role
router.delete(
    "/delete/:templeId/:roleId",
    verifyAdmin,
    wrapAsync(role.deleteController),
);

module.exports = router ; 
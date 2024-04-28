const express = require("express");
const router = express.Router({ mergeParams : true });
const daan = require("../controllers/daanController");
const wrapAsync = require("../utils/wrapAsync");
const {  validateDaanSchema } = require("../middleware");
const { verifyCreatePermission, verifyReadPermission, verifyUpdatePermission, verifyDeletePermission } = require("../utils/verifyPermissions");

//create new  Daan 
router.post(
    "/create/:templeId",
    verifyCreatePermission,
    validateDaanSchema,
    wrapAsync(daan.createDaanController),
); 

//get all daan data
router.get(
    "/get/:templeId",
    verifyReadPermission,
    wrapAsync(daan.getDataController),
);
//get one daan data
router.get(
    "/:templeId/:id",
    verifyReadPermission,
    wrapAsync(daan.getOneDaanController),
);

//update daan data
router.put(
    "/edit/:templeId/:id",
    verifyUpdatePermission,
    validateDaanSchema,
    wrapAsync(daan.updateDaanController),
);

//delete daan data
router.delete(
    "/delete/:templeId/:id",
    verifyDeletePermission,
    wrapAsync(daan.deleteDaanController),
);


module.exports = router ; 
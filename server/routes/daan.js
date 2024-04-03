const express = require("express");
const router = express.Router({ mergeParams : true });
const daan = require("../controllers/daanController");
const wrapAsync = require("../utils/wrapAsync");
const {  validateDaanSchema } = require("../middleware");

//create new  Daan 
router.post(
    "/create",
    validateDaanSchema,
    wrapAsync(daan.createDaanController),
); 

//get all daan data
router.get(
    "/",
    wrapAsync(daan.getDataController),
);
//get one daan data
router.get(
    "/:id",
    wrapAsync(daan.getOneDaanController),
);

//update daan data
router.put(
    "/edit/:id",
    validateDaanSchema,
    wrapAsync(daan.updateDaanController),
);

//delete daan data
router.delete(
    "/delete/:id",
    wrapAsync(daan.deleteDaanController),
);


module.exports = router ; 
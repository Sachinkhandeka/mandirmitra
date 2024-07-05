const express = require("express");
const router = express.Router({ mergeParams : true });
const inventory = require("../controllers/inventoryController");
const wrapAsync = require("../utils/wrapAsync");
const { validateInventorySchema } = require("../middleware");

router.post(
    "/create/:templeId",
    validateInventorySchema,
    wrapAsync(inventory.create),
);

module.exports = router ; 
const express = require("express");
const router = express.Router({ mergeParams : true });
const inventory = require("../controllers/inventoryController");
const wrapAsync = require("../utils/wrapAsync");
const { validateInventorySchema } = require("../middleware");
const { verifyCreatePermission, verifyReadPermission, verifyUpdatePermission, verifyDeletePermission } = require("../utils/verifyPermissions");

router.post(
    "/create/:templeId",
    validateInventorySchema,
    verifyCreatePermission,
    wrapAsync(inventory.create),
);

router.get(
    "/get/:templeId",
    verifyReadPermission,
    wrapAsync(inventory.AllInventories),
);

router.put(
    "/edit/:inventoryId/:templeId",
    validateInventorySchema,
    verifyUpdatePermission,
    wrapAsync(inventory.edit),
);

module.exports = router ; 
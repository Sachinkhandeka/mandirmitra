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
    wrapAsync(inventory.getInventories),
);

router.put(
    "/edit/:inventoryId/:templeId",
    validateInventorySchema,
    verifyUpdatePermission,
    wrapAsync(inventory.edit),
);

router.delete(
    "/delete/:inventoryId/:templeId",
    verifyDeletePermission,
    wrapAsync(inventory.delete),
);

module.exports = router ; 
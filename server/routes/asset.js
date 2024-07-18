const express = require("express");
const router = express.Router();
const { validateAssetSchema } = require("../middleware");
const asset = require("../controllers/assetController");
const { verifyCreatePermission, verifyReadPermission, verifyUpdatePermission, verifyDeletePermission } = require("../utils/verifyPermissions");
const wrapAsync = require("../utils/wrapAsync");

router.post(
    "/create/:templeId",
    verifyCreatePermission,
    validateAssetSchema,
    wrapAsync(asset.createAsset),
);

router.get(
    "/get/:templeId",
    verifyReadPermission,
    wrapAsync(asset.getAssets),
);

router.put(
    "/addTenant/:templeId/:assetId",
    verifyCreatePermission,
    wrapAsync(asset.addTenantToAsset),
);

router.put(
    "/removeTenant/:templeId/:assetId",
    verifyCreatePermission,
    wrapAsync(asset.removeTenantFromAsset),
);

module.exports = router ; 
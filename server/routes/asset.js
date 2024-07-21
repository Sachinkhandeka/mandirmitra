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
    verifyUpdatePermission,
    wrapAsync(asset.addTenantToAsset),
);

router.put(
    "/removeTenant/:templeId/:assetId",
    verifyUpdatePermission,
    wrapAsync(asset.removeTenantFromAsset),
);

router.put(
    "/update/:templeId/:assetId",
    validateAssetSchema,
    verifyUpdatePermission,
    wrapAsync(asset.updateAsset),
);

module.exports = router ; 
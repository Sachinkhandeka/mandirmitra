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

module.exports = router ; 
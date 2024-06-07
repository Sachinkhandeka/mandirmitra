const express = require("express");
const router  = express.Router({ mergeParams : true });
const seva = require("../controllers/sevaController");
const wrapAsyn = require("../utils/wrapAsync");
const { verifyCreatePermission } = require("../utils/verifyPermissions");

router.post(
    "/create/:templeId",
    verifyCreatePermission,
    wrapAsyn(seva.create),
);

router.get(
    "/get/:templeId",
    verifyCreatePermission,
    wrapAsyn(seva.getSeva),
);

module.exports = router ; 
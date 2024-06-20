const express = require("express");
const router  = express.Router({ mergeParams : true });
const seva = require("../controllers/sevaController");
const wrapAsyn = require("../utils/wrapAsync");
const { verifyCreatePermission, verifyUpdatePermission, verifyDeletePermission, verifyReadPermission } = require("../utils/verifyPermissions");

router.post(
    "/create/:templeId",
    verifyCreatePermission,
    wrapAsyn(seva.create),
);

router.get(
    "/get/:templeId",
    verifyReadPermission,
    wrapAsyn(seva.getSeva),
);

router.put(
    "/edit/:sevaId/:templeId",
    verifyUpdatePermission,
    wrapAsyn(seva.editSeva),
);

router.delete(
    "/delete/:sevaId/:templeId",
    verifyDeletePermission,
    wrapAsyn(seva.deleteSeva),
);

module.exports = router ; 
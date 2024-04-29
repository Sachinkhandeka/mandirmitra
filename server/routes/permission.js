const express = require("express");
const router = express.Router({ mergeParams : true });
const permission = require("../controllers/permissions");
const wrapAsync = require("../utils/wrapAsync");
const { verifyAdmin } = require("../utils/verifyAdmin");
const { validatePermissionSchema } = require("../middleware");


//create permissions route
router.post(
    "/create",
    verifyAdmin,
    validatePermissionSchema,
    wrapAsync(permission.createController),
);

//get route
router.get(
    "/get/:templeId",
    verifyAdmin,
    wrapAsync(permission.getController),
);

//edit route
router.put(
    "/edit/:templeId/:permissionId",
    verifyAdmin,
    validatePermissionSchema,
    wrapAsync(permission.editController),
);

//delete route
router.delete(
    "/delete/:templeId/:permissionId",
    verifyAdmin,
    wrapAsync(permission.deleteController),
);

module.exports = router ; 

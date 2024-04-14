const express = require("express");
const router = express.Router({ mergeParams : true });
const superAdmin = require("../controllers/superAdminController");
const wrapAsync = require("../utils/wrapAsync");
const { verifyToken } = require("../utils/verifyUser");

//create superadmin 
router.post(
    "/create",
    wrapAsync(superAdmin.createController),
);

//login route for superadmin
router.post(
    "/signin",
    wrapAsync(superAdmin.signinController),
);

//google auth route
router.post(
    "/google",
    wrapAsync(superAdmin.googleController),
);

//edit superAdmin route
router.put(
    "/edit/:id",
    verifyToken ,
    wrapAsync(superAdmin.editController),
);

//signout  route
router.post(
    "/signout",
    superAdmin.signoutController,
);


module.exports = router ; 
const express = require("express");
const router = express.Router({ mergeParams : true });
const superAdmin = require("../controllers/superAdminController");
const wrapAsync = require("../utils/wrapAsync");
const { verifyToken } = require("../utils/verifyUser");
const { validateSuperAdminSchema } = require("../middleware");

//create superadmin 
router.post(
    "/create",
    validateSuperAdminSchema,
    wrapAsync(superAdmin.createController),
);

//login with phoneNumber
router.post(
    "/login",
    wrapAsync(superAdmin.singinWithPhoneNumber),
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
    "/edit/:templeId/:id",
    verifyToken ,
    validateSuperAdminSchema,
    wrapAsync(superAdmin.editController),
);

//signout  route
router.post(
    "/signout",
    verifyToken,
    superAdmin.signoutController,
);

//refresh token
router.post(
    "/refresh-token",
    wrapAsync(superAdmin.refreshTokenController),
);

module.exports = router ; 
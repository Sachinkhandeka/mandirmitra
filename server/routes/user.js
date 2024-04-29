const express = require("express");
const router = express.Router({ mergeParams : true });
const user = require("../controllers/userController");
const wrapAsync = require("../utils/wrapAsync");
const { verifyAdmin } = require("../utils/verifyAdmin");
const { verifyToken } = require("../utils/verifyUser");
const { validateUserSchema } = require("../middleware");

//signin route
router.post(
    "/signin",
    wrapAsync(user.signinController),
);

//create route
router.post(
    "/create/:templeId",
    verifyAdmin,
    validateUserSchema,
    wrapAsync(user.createController),
);

//get route
router.get(
    "/get/:templeId",
    verifyAdmin,
    wrapAsync(user.getController),
);

// edit route
router.put(
    "/edit/:templeId/:userId",
    verifyToken,
    validateUserSchema,
    wrapAsync(user.editController),
);

//delete route
router.delete(
    "/delete/:templeId/:userId",
    verifyToken,
    wrapAsync(user.deleteController),
);

module.exports = router ; 
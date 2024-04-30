const express = require("express");
const router = express.Router({ mergeParams :  true });
const temple = require("../controllers/templeController");
const wrapAsync = require("../utils/wrapAsync");
const { validateTempleSchema } = require("../middleware");
const { verifyToken } = require("../utils/verifyUser");

//create temple
router.post(
    "/add",
    validateTempleSchema,
    wrapAsync(temple.addController),
);

//get temple
router.get(
    "/get/:templeId",
    verifyToken,
    wrapAsync(temple.getController),
)

module.exports = router ;   
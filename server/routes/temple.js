const express = require("express");
const router = express.Router({ mergeParams :  true });
const temple = require("../controllers/templeController");
const wrapAsync = require("../utils/wrapAsync");
const { validateTempleSchema } = require("../middleware");
const { verifyToken } = require("../utils/verifyUser");
const { verifyAdmin } = require("../utils/verifyAdmin");

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
);

//get all temples
router.get(
    "/all",
    wrapAsync(temple.getAllTemplesController),
);

//get one temple detail
router.get(
    "/:id",
    wrapAsync(temple.getOneTempleController),
);

//edit temple 
router.put(
    "/edit/:templeId",
    verifyAdmin,
    wrapAsync(temple.editController),
);

//analytics route
router.get(
    "/analytics/:templeId",
    verifyToken,
    wrapAsync(temple.analyticalController),
);

module.exports = router ;   
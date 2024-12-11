const express = require("express");
const router = express.Router({ mergeParams :  true });
const temple = require("../controllers/templeController");
const wrapAsync = require("../utils/wrapAsync");
const { validateTempleSchema } = require("../middleware");
const { verifyToken } = require("../utils/verifyUser");
const { verifyAdmin } = require("../utils/verifyAdmin");
const { verifyDevoteeToken } = require("../utils/verifyDevotee");

//create temple
router.post(
    "/add/:type",
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
    "/edit/:templeId/:type",
    validateTempleSchema,
    verifyAdmin,
    wrapAsync(temple.editController),
);

//analytics route
router.get(
    "/analytics/:templeId",
    verifyToken,
    wrapAsync(temple.analyticalController),
);

router.post(
    "/:templeId/anuyayi/:devoteeId",
    verifyDevoteeToken,
    wrapAsync(temple.anuyayi),
);

router.post(
    "/:templeId/:entityType/:entityId/like",
    verifyDevoteeToken,
    wrapAsync(temple.likeDislikeController)
);

module.exports = router ;   
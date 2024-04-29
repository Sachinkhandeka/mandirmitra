const express = require("express");
const router = express.Router({ mergeParams :  true });
const temple = require("../controllers/templeController");
const wrapAsync = require("../utils/wrapAsync");
const { validateTempleSchema } = require("../middleware");

router.post(
    "/add",
    validateTempleSchema,
    wrapAsync(temple.addController),
);

module.exports = router ;   
const express = require("express");
const router = express.Router({ mergeParams :  true });
const temple = require("../controllers/templeController");
const wrapAsync = require("../utils/wrapAsync");

router.post(
    "/add",
    wrapAsync(temple.addController),
);

module.exports = router ;   
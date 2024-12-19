const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync");
const sitemap = require("../controllers/sitemapController");

router.get(
    "/sitemap.xml",
    wrapAsync(sitemap.getSitemapController),
);

module.exports = router ; 
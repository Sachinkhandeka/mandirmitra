const express = require("express");
const  router = express.Router({ mergeParams : true });
const location = require("../controllers/LocationController");
const wrapAsyn = require("../utils/wrapAsync");
const { verifyCreatePermission } = require("../utils/verifyPermissions");
const { route } = require("./temple");
const { verifyToken } = require("../utils/verifyUser");

//add location 
router.post(
    "/add/:templeId",
    verifyCreatePermission,
    wrapAsyn(location.addController),
);

//get countries
router.get(
    "/countries/:templeId",
    verifyToken,
    wrapAsyn(location.getAllCountry),
);

//get states
router.get(
    "/states/:templeId/:countryId",
    verifyToken,
    wrapAsyn(location.getStatesByCountry),
);

//get districts
router.get(
    "/districts/:templeId/:stateId",
    verifyToken,
    wrapAsyn(location.getDistrictsByState),
);

//get tehsils
router.get(
    "/tehsils/:templeId/:districtId",
    wrapAsyn(location.getTehsilsByDistrict),
);

//get villages
router.get(
    "/villages/:templeId/:tehsilId",
    wrapAsyn(location.getVillagesByTehsil),
);

module.exports = router; 
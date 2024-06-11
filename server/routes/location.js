const express = require("express");
const  router = express.Router({ mergeParams : true });
const location = require("../controllers/LocationController");
const wrapAsyn = require("../utils/wrapAsync");
const { verifyCreatePermission, verifyUpdatePermission, verifyDeletePermission } = require("../utils/verifyPermissions");
const { route } = require("./temple");
const { verifyToken } = require("../utils/verifyUser");

//add location 
router.post(
    "/add/:templeId",
    verifyCreatePermission,
    wrapAsyn(location.addController),
);

//get all 
router.get(
    "/get/:templeId",
    verifyToken,
    wrapAsyn(location.getAll),
);

//edit all 
router.put(
    "/edit/:entityId/:templeId",
    verifyUpdatePermission,
    wrapAsyn(location.editEntity),
);

//delete all
router.delete(
    "/delete/:entityId/:templeId",
    verifyDeletePermission,
    wrapAsyn(location.deleteEntity),
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
    verifyToken,
    wrapAsyn(location.getTehsilsByDistrict),
);

//get villages
router.get(
    "/villages/:templeId/:tehsilId",
    verifyToken,
    wrapAsyn(location.getVillagesByTehsil),
);

//get all data
router.get(
    "/get/:templeId",
    verifyToken,
    wrapAsyn(location.getAllController),
);

module.exports = router; 
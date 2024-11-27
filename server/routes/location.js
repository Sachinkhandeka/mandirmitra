const express = require("express");
const  router = express.Router({ mergeParams : true });
const location = require("../controllers/LocationController");
const wrapAsyn = require("../utils/wrapAsync");
const { verifyCreatePermission, verifyReadPermission, verifyUpdatePermission, verifyDeletePermission } = require("../utils/verifyPermissions");
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
    verifyReadPermission,
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
    verifyReadPermission,
    wrapAsyn(location.getAllCountry),
);

//get states
router.get(
    "/states/:templeId/:countryId",
    verifyReadPermission,
    wrapAsyn(location.getStatesByCountry),
);

//get districts
router.get(
    "/districts/:templeId/:stateId",
    verifyReadPermission,
    wrapAsyn(location.getDistrictsByState),
);

//get tehsils
router.get(
    "/tehsils/:templeId/:districtId",
    verifyReadPermission,
    wrapAsyn(location.getTehsilsByDistrict),
);

//get villages
router.get(
    "/villages/:templeId/:tehsilId",
    verifyReadPermission,
    wrapAsyn(location.getVillagesByTehsil),
);

//get all data
router.get(
    "/get/:templeId",
    verifyReadPermission,
    wrapAsyn(location.getAllController),
);

module.exports = router; 
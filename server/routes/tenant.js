const express = require("express") ;
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const wrapAsync = require("../utils/wrapAsync");
const { validateTenantSchema } = require("../middleware");
const { verifyCreatePermission, verifyReadPermission, verifyUpdatePermission, verifyDeletePermission } = require("../utils/verifyPermissions");

router.post(
    "/create/:templeId",
    validateTenantSchema,
    wrapAsync(tenantController.createTenant),
); 

module.exports = router ; 
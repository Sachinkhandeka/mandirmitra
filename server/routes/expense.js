const express = require("express");
const router = express.Router();
const wrapAsyn = require("../utils/wrapAsync");
const expense = require("../controllers/expenseController");
const { verifyCreatePermission, verifyReadPermission, verifyUpdatePermission, verifyDeletePermission } = require("../utils/verifyPermissions");
const { validateExpenseSchema } = require("../middleware");

//add or  create new expense route
router.post(
    "/create/:templeId",
    verifyCreatePermission,
    validateExpenseSchema,
    wrapAsyn(expense.createController),
);

module.exports = router ; 
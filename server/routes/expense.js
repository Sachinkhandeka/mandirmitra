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

//get all expenses for temple
router.get(
    "/get/:templeId",
    verifyReadPermission,
    wrapAsyn(expense.getController),
);

//edit expense for  temple
router.put(
    "/edit/:expenseId/:templeId",
    verifyUpdatePermission,
    validateExpenseSchema,
    wrapAsyn(expense.editController),
);

//edit expense for  temple
router.delete(
    "/delete/:expenseId/:templeId",
    verifyDeletePermission,
    wrapAsyn(expense.deleteController),
);

module.exports = router ; 
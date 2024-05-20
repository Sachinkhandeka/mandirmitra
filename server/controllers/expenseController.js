const Expense = require("../models/expenseSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.createController = async(req, res)=> {
    const templeId = req.params.templeId ; 
    const formData = req.body ; 

    if(!templeId) {
        throw new ExpressError(400, "Temple not found.");
    }

    if(!formData.title && !formData.description && !formData.amount && !formData.date && !formData.category && !formData.status) {
        throw new ExpressError(400, "Please provide all expense details.");
    }
    
    const newExpense = new Expense({
        title : formData.title,
        description : formData.description,
        amount : formData.amount,
        date : formData.date,
        category : formData.category,
        status : formData.status,
        temple : templeId,
    });

    await newExpense.save();
    res.status(200).json( "Expense added successfully.");
}

//get  all expense data
module.exports.getController = async (req, res) => {
    const templeId = req.params.templeId;
    const startIndx = parseInt(req.query.startIndx) || 0;
    const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;

    if (!templeId) {
        throw new ExpressError(400, "Temple id not found.");
    }

    // Define search criteria based on query parameters
    const searchCriteria = {
        temple: templeId,
    };

    // Add optional search criteria if present in query parameters
    if (req.query.category) searchCriteria.category = { $regex: req.query.category, $options: 'i' };
    if (req.query.searchTerm) {
        searchCriteria.$or = [
            { title: { $regex: req.query.searchTerm, $options: 'i' } },
            { description: { $regex: req.query.searchTerm, $options: 'i' } },
        ];
    }

    // Add range search for amount if minAmount and maxAmount parameters are present
    if (req.query.minAmount || req.query.maxAmount) {
        searchCriteria.amount = {};
        if (req.query.minAmount) searchCriteria.amount.$gte = parseFloat(req.query.minAmount);
        if (req.query.maxAmount) searchCriteria.amount.$lte = parseFloat(req.query.maxAmount);
    }

    // Add status filter if present in query parameters
    if (req.query.status) searchCriteria.status = req.query.status;
    
    try {
        // Fetch filtered expenses with pagination and sorting
        const allExpenses = await Expense.find(searchCriteria)
            .skip(startIndx)
            .sort({ updatedAt: sortDirection });

        // Count total expenses for the given temple with filters
        const totalExpenses = await Expense.countDocuments(searchCriteria);

        res.status(200).json({
            allExpenses,
            totalExpenses
        });
    } catch (err) {
        throw new ExpressError(500, "Failed to fetch expenses.");
    }
}

// edit expense 
module.exports.editController = async (req, res) => {
    const { expenseId, templeId } = req.params; 
    const formData = req.body; 

    if (!templeId) {
        throw new ExpressError(400, "Temple ID not found.");
    }

    if (!expenseId) {
        throw new ExpressError(400, "Expense ID not found.");
    }

    // Find and update the expense
    const updatedExpense = await Expense.findOneAndUpdate(
        { _id: expenseId, temple: templeId },
        formData,
        { new: true }
    );

    if (!updatedExpense) {
        throw new ExpressError(404, "Expense not found.");
    }

    res.status(200).json("Expense updated successfully.");
};

//delete expense
module.exports.deleteController = async(req ,res)=> {
    const { expenseId, templeId } = req.params ; 

    if (!templeId) {
        throw new ExpressError(400, "Temple ID not found.");
    }

    if (!expenseId) {
        throw new ExpressError(400, "Expense ID not found.");
    }

    // Find the expense and delete it
    const deletedExpense = await Expense.findOneAndDelete({ _id: expenseId, temple: templeId });

    if (!deletedExpense) {
        throw new ExpressError(404, "Expense not found.");
    }

    res.status(200).json("Expense deleted successfully.");
}
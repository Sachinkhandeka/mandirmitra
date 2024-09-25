const Expense = require("../models/expenseSchema");
const Event = require("../models/eventSchema");
const ExpressError = require("../utils/ExpressError");

module.exports.createController = async (req, res) => {
    const templeId = req.params.templeId;
    const formData = req.body;

    if (!templeId) {
        throw new ExpressError(400, "Temple not found.");
    }

    const { title, amount, date, category, status, event } = formData;

    if (!title || !amount || !date || !category || !status) {
        throw new ExpressError(400, "Please provide all required expense details.");
    }

    let associatedEvent = null;
    if (event) {
        associatedEvent = await Event.findById(event);
        if (!associatedEvent) {
            throw new ExpressError(400, "Invalid event ID.");
        }
    }

    const newExpense = new Expense({
        title,
        amount,
        date,
        category,
        status,
        temple: templeId,
        event: associatedEvent ? associatedEvent._id : "",
    });

    await newExpense.save();

    res.status(200).json("Expense added successfully.");
};

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

    // Add optional event filtering if event ID is provided
    if (req.query.event) searchCriteria.event = req.query.event;

    try {
        // Fetch filtered expenses with pagination, sorting, and event population
        const allExpenses = await Expense.find(searchCriteria)
            .skip(startIndx)
            .sort({ updatedAt: sortDirection })
            .populate('event', 'name')
            .exec();

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

    let associatedEvent = null;
    if (formData.event && formData.event !== "") {
        associatedEvent = await Event.findById(formData.event);
        if (!associatedEvent) {
            throw new ExpressError(400, "Invalid event ID.");
        }
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
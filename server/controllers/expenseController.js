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

//get all expenses for temple
module.exports.getController = async(req ,res)=> {
    const templeId = req.params.templeId ; 

    if(!templeId) {
        throw new ExpressError(400, "Temple id not found.");
    }

    const allExpenses = await Expense.find({ temple : templeId });

    res.status(200).json({allExpenses});
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
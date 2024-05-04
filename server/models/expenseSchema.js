const mongoose =  require("mongoose");
const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: String,
    status: {
        type: String,
        enum: ['pending','approved','completed','rejected'],
        default: 'pending'
    },
    temple : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Temple",
    }
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense ; 
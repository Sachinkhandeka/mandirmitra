const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String,
        enum: [
            'Rituals & Poojas',
            'Festivals & Events',
            'Maintenance & Repairs',
            'Utilities',
            'Staff Salaries',
            'Charity & Donations',
            'Food & Prasadam',
            'Decorations & Flowers',
            'Security',
            'Miscellaneous'
        ],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'completed', 'rejected'],
        default: 'pending'
    },
    temple: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Temple",
        required: true
    },
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        default: null
    }
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;

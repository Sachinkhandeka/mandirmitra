const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    unit: {
        type: String,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
    },
    templeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Temple",
        required: true,
    }
});

const InventoryItem = mongoose.model("InventoryItem", inventorySchema);

module.exports = InventoryItem ; 
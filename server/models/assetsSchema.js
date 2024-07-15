const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
    assetType: {
        type: String,
        enum: ['Land', 'Building', 'Shop', 'Rental Property', 'Vehicle', 'Jewelry', 'Furniture', 'Equipment'],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    acquisitionDate: {
        type: Date,
    },
    acquisitionCost: {
        type: Number,
    },
    currentValue: {
        type: Number,
    },
    address: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'Under Maintenance', 'Inactive'],
        default: 'Active'
    },
    templeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Temple',
        required: true
    },
    rentDetails: {
        tenant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tenant',
        },
        rentAmount: {
            type: Number,
        },
        leaseStartDate: {
            type: Date,
        },
        leaseEndDate: {
            type: Date,
        },
        paymentStatus: {
            type: String,
            enum: ['Paid', 'Pending', 'Overdue'],
            default: 'Pending',
        }
    }
}, { timestamps: true });

const Asset = mongoose.model('Asset', assetSchema);

module.exports = Asset;

const mongoose = require('mongoose');
const Asset = require("../models/assetsSchema");

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contactInfo: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return v.length === 10;
            },
            message: "Mobile number must have exactly 10 characters."
        }
    },
    email: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return /^\S+@\S+\.\S+$/.test(v);
            },
            message: "Please provide a valid email address."
        }
    },
    address: {
        type: String,
        required: true,
    },
    pinCode: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    templeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Temple",
    }
}, { timestamps: true });

tenantSchema.post("findOneAndDelete", async(tenant)=> {
    const tenantId = tenant._id;

    await Asset.updateMany(
        { "rentDetails.tenant" : tenantId },
        { $unset : { rentDetails : {} } }
    )
});

const Tenant = mongoose.model('Tenant', tenantSchema);

module.exports = Tenant;

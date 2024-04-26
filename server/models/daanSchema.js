const mongoose = require("mongoose");

const daanShema = new mongoose.Schema({
    temple : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Temple",
    },
    donorName : {
        type : String,
        required  : true,
    },
    village : {
        type : String,
        required : true,
    },
    tehsil : {
        type : String,
        required : true,
    },
    district : {
        type : String,
        required : true,
    },
    state : {
        type : String,
        required : true,
    },
    country : {
        type : String,
        required : true,
    },
    sevaName : {
        type : String,
        required : true,
    },
    contactInfo : {
        type : String,
        required : true,
        validate : {
            validator : function(v) {
                return v.length === 10;
            },
            message : "Mobile number must have exactly 10 characters."
        }
    },
    paymentMethod : {
        type : String,
        enum : ["cash", "bank", "upi"],
    },
    donationAmount : {
        type : Number,
        required : true,
    }
}, { timestamps : true });

const Daan = mongoose.model("Daan", daanShema );

module.exports = Daan ; 

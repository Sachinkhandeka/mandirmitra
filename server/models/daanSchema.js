const mongoose = require("mongoose");

const daanShema = new mongoose.Schema({
    name : {
        type : String,
        required  : true,
    },
    gaam : {
        type : String,
        required : true,
    },
    taluko : {
        type : String,
        required : true,
    },
    seva : {
        type : String,
        required : true,
    },
    mobileNumber : {
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
    amount : {
        type : Number,
        required : true,
    }
}, { timestamps : true });

const Daan = mongoose.model("Daan", daanShema );

module.exports = Daan ; 

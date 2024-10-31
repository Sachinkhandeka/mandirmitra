const mongoose = require("mongoose");

const devoteeSchema = new mongoose.Schema({
    displayName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    phoneNumber : {
        type : String,
        required : true,
    },
    photoURL : {
        type : String,
        default : undefined,
    },
});

const Devotee = mongoose.model("devotee", devoteeSchema );

module.exports = Devotee ; 
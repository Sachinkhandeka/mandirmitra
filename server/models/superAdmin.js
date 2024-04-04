const mongoose = require("mongoose");

const superAdminSchema = new  mongoose.Schema({
    username : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    profilePicture : {
        type : String,
        default : 'https://www.clipartmax.com/png/middle/82-820644_author-image-admin-icon.png',
    }
},{ timestamps : true });

const SuperAdmin = mongoose.model("SuperAdmin", superAdminSchema);

module.exports = SuperAdmin ; 
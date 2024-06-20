const mongoose = require("mongoose");

const userSchema =  new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
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
        default : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXNChij9NGxfXhZQeEwg0TG9WAK6vm4vVm-e0EncJcCQ&s',
    },
    isAdmin : {
        type : Boolean,
        default : false,
    },
    templeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Temple",
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    roles : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Role"
    }]
},{ timestamps : true });

const User = mongoose.model("User", userSchema);

module.exports = User ; 
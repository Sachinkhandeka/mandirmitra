const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
    role : {
        type : mongoose.Schema.Types.ObjectId,
        ref : Role,
    },
    resource  : {
        type : String,
        required : true,
    },
    actions : [String],
}, { timestamps : true });

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission ; 
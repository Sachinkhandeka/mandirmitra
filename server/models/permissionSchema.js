const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
    permissionName : {
        type : String,
        required : true,
    },
    templeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Temple',
    },
    actions : [String],
}, { timestamps : true });

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission ; 
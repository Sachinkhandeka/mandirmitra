const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
    permissionName : {
        type : String,
        enum: [
            'donation-creator',
            'donation-viewer',
            'donation-editor',
            'donation-deleter',
            'donation-contributor',
            'donation-manager',
            'donation-supervisor',
        ],
    },
    templeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Temple',
    },
    actions :{
        type : [String],
        enum : ['create', 'read', 'update', 'delete'],
    },
}, { timestamps : true });

const Permission = mongoose.model("Permission", permissionSchema);

module.exports = Permission ; 
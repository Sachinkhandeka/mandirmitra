const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    templeId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Temple',
    },
    name : {
        type : String,
        required : true,
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
    }],
}, { timestamps : true });

const Role = mongoose.model("Role", roleSchema);

module.exports =  Role  ;  
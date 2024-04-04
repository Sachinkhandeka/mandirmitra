const mongoose = require("mongoose");

const  templeSchema = new mongoose.Schema({
    name :  {
        type : String,
        required : true,
    },
    location : {
        type : String,
        required : true,
    },
    image : {
        type : String,
        default : 'https://png.pngtree.com/png-vector/20230207/ourmid/pngtree-om-logo-design-with-flower-mandala-png-image_6590267.png'
    },
    superAdmin : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "SuperAdmin",
    },
},{ timestamps : true });

const Temple = mongoose.model("Temple", templeSchema);

module.exports = Temple ; 
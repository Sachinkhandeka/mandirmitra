const mongoose = require("mongoose");

const sevaSchema = new mongoose.Schema({
    temple : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Temple",
    },
    sevaName : {
        type : String,
        required : true,
    }
});

const Seva = mongoose.model("Seva", sevaSchema);

module.exports = Seva ; 
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    name : { 
        type : String,
        required : true,
    },
    date : {
        type : Date,
        required  : true,
    },
    location : {
        type : String,
        required : true,
    },
    status : {
        type : String,
        enum : ["pending", "completed"],
    },
    temple  : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Temple",
    },
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event ; 
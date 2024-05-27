const mongoose = require("mongoose");

const invitationSchema = new mongoose.Schema({
    donorName : {
        type : String,
        required : true,
    },
    passCode : {
        type : String,
        required : true,
    },
    invited : {
        type  : Boolean,
        default : false,
    },
    attended  : {
        type : Boolean,
        default : false,
    },
    temple : {
        type : mongoose.Schema.Types.ObjectId,
        ref  : 'Temple',
    },
    event : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Event',
    },
});


const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = Invitation ; 
const { required } = require("joi");
const mongoose = require("mongoose");

const  templeSchema = new mongoose.Schema({
    name :  {
        type : String,
        required : true,
    },
    alternateName : {
        type : String,
    },
    location : {
        type : String,
        required : true,
    },
    image : {
        type : String,
        default : 'https://png.pngtree.com/png-vector/20230207/ourmid/pngtree-om-logo-design-with-flower-mandala-png-image_6590267.png'
    },
    godsAndGoddesses: [
        {
            name: {
                type : String,
                required : true,
            },
            description : {
                type : String,
            },
            image: {
                type : String,
                required : true,
            }
        }
    ],
    description: {
        type : String,
    },
    historyImages : [{ type : String }],
    foundedYear: {
        type : Number,
    },
    festivals : [
        {
            festivalName : { type : String },
            festivalImportance : { type : String },
            festivalImages : [{ type : String }],
        }
    ],
    videos : [{
        title : { type : String, required : true },
        description : { type : String, required : true },
        url : { type : String, required : true },
    }],
    pujaris : [
        {
            name : { type : String, },
            profile : { type : String },
            experience : { type : Number, default : 0 },
            designation: { type: String},
            specialization: { type: String},
            contactInfo: {
                type: String, 
                match: [/^\d{10}$/, 'Phone number is invalid'],
            },
        }
    ],
    management : [
        {
            name : { type : String },
            role : { type : String },
            profile : { type : String },
        }
    ],
    anuyayi: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Devotee',
    }] 
},{ timestamps : true });

const Temple = mongoose.model("Temple", templeSchema);

module.exports = Temple ; 
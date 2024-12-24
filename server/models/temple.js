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
        default : 'https://firebasestorage.googleapis.com/v0/b/mandirmitra-bd32e.appspot.com/o/DALL%C2%B7E%202024-12-24%2011.10.00%20-%20A%20refined%20and%20spiritual%20background%20image%20for%20MandirMitra%2C%20showcasing%20only%20Hindu%20temple%20architecture%2C%20including%20intricate%20designs%20of%20domes%2C%20spires%2C%20and.webp?alt=media&token=75f261c0-2d9d-464e-8629-f20ede914ef8'
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
            },
            likes: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Devotee',
                },
            ],
            comments: [
                {
                    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Devotee' },
                    comment: { type: String, required: true, maxlength: 500 },
                    createdAt: { type: Date, default: Date.now },
                },
            ],
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
            likes: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Devotee',
                },
            ],
            comments: [
                {
                    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Devotee' },
                    comment: { type: String, required: true, maxlength: 500 },
                    createdAt: { type: Date, default: Date.now },
                },
            ],
        }
    ],
    videos : [{
        title : { type : String, required : true },
        description : { type : String, required : true },
        url : { type : String, required : true },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Devotee',
            },
        ],
        comments: [
            {
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'Devotee' },
                comment: { type: String, required: true, maxlength: 500 },
                createdAt: { type: Date, default: Date.now },
            },
        ],
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
            likes: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Devotee',
                },
            ],
            comments: [
                {
                    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Devotee' },
                    comment: { type: String, required: true, maxlength: 500 },
                    createdAt: { type: Date, default: Date.now },
                },
            ],
        }
    ],
    management : [
        {
            name : { type : String },
            role : { type : String },
            profile : { type : String },
            likes: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Devotee',
                },
            ],
            comments: [
                {
                    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Devotee' },
                    comment: { type: String, required: true, maxlength: 500 },
                    createdAt: { type: Date, default: Date.now },
                },
            ],
        }
    ],
    anuyayi: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Devotee',
    }] 
},{ timestamps : true });

const Temple = mongoose.model("Temple", templeSchema);

module.exports = Temple ; 
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
        default : 'https://firebasestorage.googleapis.com/v0/b/mandirmitra-bd32e.appspot.com/o/DALL%C2%B7E%202024-12-12%2012.53.27%20-%20A%20classic%20and%20elegant%20placeholder%20image%20for%20Hindu%20temples%2C%20featuring%20traditional%20elements%20like%20a%20temple%20silhouette%20with%20domes%20and%20spires%2C%20intricate%20fl.webp?alt=media&token=94f77320-25ee-4149-8913-6daf5c03930f'
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
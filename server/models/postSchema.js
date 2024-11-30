const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        temple: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Temple',
            required: true,
        },
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SuperAdmin',
            required: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100, 
        },
        content: {
            type: String,
            required: true,
            maxlength: 1000,
        },
        images: {
            type: [String], 
            validate: [arrayLimit, 'Too many images'],
        },
        postType: {
            type: String,
            enum: ['general', 'announcement'],
            default: 'general',
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
    },
    {
        timestamps: true,
    }
);

function arrayLimit(val) {
    return val.length <= 5;
}

const Post = mongoose.model('Post', postSchema);

module.exports = Post ; 

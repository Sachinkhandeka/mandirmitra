const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
    content: { type: String, required: true },
    translation: { type: String },
    date: { type: Date, default: Date.now },
    isHighlighted: { type: Boolean, default: false },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Temple",
        required : true, 
    },
    viewedBy: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "Devotee"
        }
    ],
    expiresAt: { 
        type: Date,
        default: () => Date.now() + 24 * 60 * 60 * 1000, // 24 hours from creation
        index: { expires: '1s' } // TTL index (deletes when expiresAt is reached)
    }
});

const Story = mongoose.model("Story", storySchema);

module.exports = Story ; 
  
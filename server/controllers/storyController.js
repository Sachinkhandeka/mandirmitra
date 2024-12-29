const Temple = require("../models/temple");
const Story = require("../models/storySchema");
const ExpressError = require("../utils/ExpressError");

module.exports.createStory = async (req, res) => {
    const { templeId } = req.params;
    const { storyData } = req.body;
    // Check if the referenced temple and super admin exist
    const temple = await Temple.findById(templeId);
    if (!temple) throw new ExpressError(404, "Temple not found");

    // Create and save the story
    const story = new Story({
        content : storyData.content,
        translation : storyData.translation,
        isHighlighted : storyData.isHighlighted,
        createdBy: templeId,
    });
    await story.save();

    res.status(201).json({
        message: "Story created successfully",
        story,
    });
};

module.exports.editStory = async (req, res) => {
    const { storyId } = req.params; 
    const { storyData } = req.body;

    // Find and update the story
    const updatedStory = await Story.findByIdAndUpdate(
        storyId,
        { 
            content : storyData.content, 
            translation : storyData.translation, 
            isHighlighted : storyData.isHighlighted
        },
        { new: true, runValidators: true }
    ).populate({
        path: "viewedBy",
        select: "displayName", // Include only the `displayName` field
    });;

    if (!updatedStory) throw new ExpressError(404, "Story not found");

    res.status(200).json({
        message: "Story updated successfully",
        story: updatedStory,
    });
};

module.exports.deleteStory = async (req, res) => {
    const { storyId } = req.params; // Story ID from params

    // Find and delete the story
    const deletedStory = await Story.findByIdAndDelete(storyId).populate({
        path: "viewedBy",
        select: "displayName", // Include only the `displayName` field
    });;
    if (!deletedStory) throw new ExpressError(404, "Story not found");

    res.status(200).json({
        message: "Story deleted successfully",
        story: deletedStory,
    });
};

module.exports.getStories = async (req, res) => {
    const { templeId } = req.params;

    // Check if the temple exists
    const temple = await Temple.findById(templeId);
    if (!temple) throw new ExpressError(404, "Temple not found");

    // Fetch stories for the given temple
    const stories = await Story.find({ createdBy : templeId }).populate({
        path: "viewedBy",
        select: "displayName", // Include only the `displayName` field
    });

    res.status(200).json({
        message: "Stories fetched successfully",
        stories,
    });
};

module.exports.addStoryView = async (req, res) => {
    const { storyId, devoteeId } = req.params;

    // Find the story and add the devotee ID to the `viewedBy` array
    const story = await Story.findByIdAndUpdate(
        storyId,
        { $addToSet: { viewedBy: devoteeId } }, // Ensures no duplicate entries
        { new: true }
    ).populate({
        path: "viewedBy",
        select: "displayName", // Include only the `displayName` field
    });;

    if (!story) throw new ExpressError(404, "Story not found");

    res.status(200).json({
        message: "Story view recorded successfully",
        story,
    });
};


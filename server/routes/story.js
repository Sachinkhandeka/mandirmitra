const express = require("express");
const router = express.Router({ mergeParams : true });
const wrapAsync = require("../utils/wrapAsync");
const story = require("../controllers/storyController");
const { verifyAdmin } = require("../utils/verifyAdmin");
const { verifyDevoteeToken } = require("../utils/verifyDevotee");
const { validateStorySchema } = require("../middleware");

// Route to create a story for a temple
router.post(
    "/:templeId",
    verifyAdmin,
    validateStorySchema,
    wrapAsync(story.createStory)
);

// Route to edit a story by its ID
router.put(
    "/:storyId",
    verifyAdmin,
    validateStorySchema,
    wrapAsync(story.editStory)
);

// Route to delete a story by its ID
router.delete(
    "/:storyId",
    verifyAdmin,
    wrapAsync(story.deleteStory)
);

// Route to get all stories for a specific temple
router.get(
    "/:templeId",
    wrapAsync(story.getStories)
);

// Route to add a view to a story by a devotee
router.put(
    "/:storyId/view/:devoteeId",
    verifyDevoteeToken,
    wrapAsync(story.addStoryView)
);


module.exports = router ; 
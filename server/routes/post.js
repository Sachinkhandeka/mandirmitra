const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router({ mergeParams : true });
const posts = require("../controllers/postController");
const { verifyAdmin } = require("../utils/verifyAdmin");
const { verifyDevoteeToken } = require("../utils/verifyDevotee");
const { validatePostSchema } = require("../middleware");

router.post(
    '/:templeId/:adminId',
    verifyAdmin,
    validatePostSchema, 
    wrapAsync(posts.createPostController)
);
router.get(
    '/:templeId', 
    wrapAsync(posts.getAllPostsController)
);
router.get(
    '/:postId', 
    wrapAsync(posts.getOnePostController)
);
router.put(
    '/:postId',
    verifyAdmin,
    validatePostSchema, 
    wrapAsync(posts.editPostController)
);
router.delete(
    '/:postId',
    verifyAdmin, 
    wrapAsync(posts.deletePostController)
);
router.post(
    '/:postId/like/:devoteeId',
    verifyDevoteeToken, 
    wrapAsync(posts.likePostController)
);
router.post(
    '/:postId/comment/:devoteeId', 
    wrapAsync(posts.addCommentController)
);

module.exports = router;
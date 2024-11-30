const Post = require("../models/postSchema");
const ExpressError = require("../utils/ExpressError");
const SuperAdmin = require("../models/superAdmin");
const Temple = require("../models/temple");
const Devotee = require("../models/devotee");

// Create a Post
module.exports.createPostController = async (req, res) => {
    const { post } = req.body;
    const { templeId, adminId } = req.params;

    // Validate temple existence
    const temple = await Temple.findById(templeId);
    if (!temple) {
        throw new ExpressError(404, "Temple not found");
    }

    // Validate admin existence
    const admin = await SuperAdmin.findById(adminId);
    if (!admin) {
        throw new ExpressError(404, "Admin not found");
    }

    // Create and save the post
    const newPost = new Post({ ...post, temple: templeId, postedBy: adminId });
    await newPost.save();

    res.status(201).json({ message: "Post created successfully", post: newPost });
};

// Get All Posts for a Temple
module.exports.getAllPostsController = async (req, res) => {
    const { templeId } = req.params;

    // Validate temple existence
    const temple = await Temple.findById(templeId);
    if (!temple) {
        throw new ExpressError(404, "Temple not found");
    }

    // Fetch all posts for the temple
    const posts = await Post.find({ temple: templeId })
        .populate([
            { path: "comments.user", select: "displayName photoURL" },
            { path: "temple", select: "name image" },
        ])
        .sort({ createdAt: -1 });

    res.status(200).json({ count: posts.length, posts });
};

// Get One Post
module.exports.getOnePostController = async (req, res) => {
    const { postId } = req.params;

    if(!postId) {
        throw new ExpressError(401, "Post id not found");
    }

    // Validate post, temple, and admin existence
    const post = await Post.findById(postId)
        .populate("temple", "name image")
        .populate("comments.user", "name");

    if (!post) {
        throw new ExpressError(404, "Post not found");
    }

    res.status(200).json({ likesCount: post.likes.length, post });
};

// Edit a Post
module.exports.editPostController = async (req, res) => {
    const { postId } = req.params;
    const { post } = req.body;

    if(!postId) {
        throw new ExpressError(401, "Post id not found");
    }

    // Validate post existence
    const existingPost = await Post.findById(postId);
    if (!existingPost) {
        throw new ExpressError(404, "Post not found");
    }

    // Update the post
    const updatedPost = await Post.findByIdAndUpdate(postId, post, { new: true, runValidators: true })
        .populate("temple", "name image")
        .populate("comments.user", "name");

    res.status(200).json({ message: "Post updated successfully", post: updatedPost });
};

// Delete a Post
module.exports.deletePostController = async (req, res) => {
    const { postId } = req.params;
    if(!postId) {
        throw new ExpressError(401, "Post id not found");
    }
    // Validate post existence
    const post = await Post.findByIdAndDelete(postId);
    if (!post) {
        throw new ExpressError(404, "Post not found or already deleted");
    }

    res.status(200).json({ message: "Post deleted successfully" });
};

// Like/Unlike a Post
module.exports.likePostController = async (req, res) => {
    const { postId, devoteeId } = req.params;

    // Validate devotee existence
    const devotee = await Devotee.findById(devoteeId);
    if (!devotee) {
        throw new ExpressError(404, "Devotee not found");
    }

    const post = await Post.findById(postId);
    if (!post) {
        throw new ExpressError(404, "Post not found");
    }

    const isLiked = post.likes.includes(devoteeId);
    if (isLiked) {
        post.likes.pull(devoteeId); // Unlike the post
    } else {
        post.likes.push(devoteeId); // Like the post
    }
    await post.save();

    res.status(200).json({ message: isLiked ? "Post unliked successfully" : "Post liked successfully", post });
};

// Add a Comment
module.exports.addCommentController = async (req, res) => {
    const { postId, devoteeId } = req.params;
    const { comment } = req.body;

    // Validate input
    if (!comment || comment.trim().length === 0) {
        throw new ExpressError(400, "Comment cannot be empty");
    }

    // Validate devotee existence
    const devotee = await Devotee.findById(devoteeId);
    if (!devotee) {
        throw new ExpressError(404, "Devotee not found");
    }

    // Validate post existence
    const post = await Post.findById(postId);
    if (!post) {
        throw new ExpressError(404, "Post not found");
    }

    // Add a comment
    const newComment = { user: devoteeId, comment };
    post.comments.push(newComment);
    await post.save();

    const populatedPost = await Post.findById(postId).populate("comments.user", "displayName photoURL");

    res.status(201).json({ message: "Comment added successfully", post: populatedPost });
};

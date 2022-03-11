const expressAsyncHandler = require("express-async-handler");
const fs = require("fs");

const Post = require("../../model/post/Post");
const User = require("../../model/user/User");
const validateMongoDbId = require("../../utils/validateMongoDbId");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const APIFeatures = require("../../utils/apiFeatures");

// Create post
const createPostCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;

  // Get the path to the image
  // const localPath = `public/images/posts/${req.file.filename}`;
  // Upload the image to the cloudinary
  // const imgUploaded = await cloudinaryUploadImg(localPath);

  try {
    const post = await Post.create({
      ...req.body,
      user: _id,
      // image: imgUploaded?.url,
    });

    // Update the post quantity
    await User.findByIdAndUpdate(
      _id,
      {
        $inc: { postQuantity: 1 },
      },
      { new: true }
    );

    // Remove uploaded photo in storage
    // fs.unlinkSync(localPath);
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

// Fetch all the posts
const fetchPostsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const features = new APIFeatures(Post.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const posts = await features.query;

    res.json({ quantity: posts.length, posts });
  } catch (error) {
    res.json(error);
  }
});

// Searching posts
const searchingPostsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const { title } = req.query;
    const results = await Post.find({
      title: { $regex: new RegExp(title) },
    }).limit(10);
    res.json(results);
  } catch (error) {
    res.json(error);
  }
});

// Fetch a post
const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const post = await Post.findById(id).populate({
      path: "comments",
      select: "rating comment -post",
    });
    if (!post) {
      res.json("No post found");
    }
    // Update number of views
    await Post.findByIdAndUpdate(id, { $inc: { numViews: 1 } }, { new: true });
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

// Update a post
const updatePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const currentPost = await Post.findById(id);
    if (!currentPost) {
      res.json("No post found");
    }
    if (req.user.id === currentPost.user.toString() || req.user.isAdmin) {
      const post = await Post.findByIdAndUpdate(
        id,
        { ...req.body, user: req.user?._id },
        { new: true }
      );
      res.json(post);
    } else {
      res.json("You do not have permission to access this api");
    }
  } catch (error) {
    res.json(error);
  }
});

// Delete a post
const deletePostCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const currentPost = await Post.findById(id);
    if (!currentPost) {
      res.json("No post found");
    }
    if (req.user.id === currentPost.user.toString() || req.user.isAdmin) {
      const post = await Post.findByIdAndDelete(id);
      res.json(post);
    } else {
      res.json("You do not have permission to access this api");
    }
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createPostCtrl,
  fetchPostsCtrl,
  searchingPostsCtrl,
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
};

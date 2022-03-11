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
  //   const localPath = `public/images/posts/${req.file.filename}`;
  // Upload the image to the cloudinary
  //   const imgUploaded = await cloudinaryUploadImg(localPath);

  try {
    const post = await Post.create({
      ...req.body,
      user: _id,
      //   image: imgUploaded?.url,
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

// Fetch a post
const fetchPostCtrl = expressAsyncHandler(async (req, res) => {
  const { slug } = req.params;
  try {
    const post = await Post.findOne({ slug }).populate("comments");
    if (post === null) {
      res.json({ Status: "No post found" });
    }
    // Update number of views
    await Post.findByIdAndUpdate(
      post.id,
      { $inc: { numViews: 1 } },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.json(error);
  }
});

// Update a post
const updatePostCtrl = expressAsyncHandler(async (req, res) => {
  const { slug } = req.params;

  try {
    const currentPost = await Post.findOne({ slug });
    if (!currentPost) {
      res.json("No post found");
    }
    if (req.user.id === currentPost.user.toString() || req.user.isAdmin) {
      const post = await Post.findOneAndUpdate(
        { slug },
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
  const { slug } = req.params;

  try {
    const currentPost = await Post.findOne({ slug });
    if (!currentPost) {
      res.json("No post found");
    }
    if (req.user.id === currentPost.user.toString() || req.user.isAdmin) {
      const post = await Post.findOneAndDelete({ slug });
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
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
};

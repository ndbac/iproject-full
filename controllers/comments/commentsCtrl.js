const expressAsyncHandler = require("express-async-handler");

const Comment = require("../../model/comment/Comment");
const validateMongoDbId = require("../../utils/validateMongoDbId");
const APIFeatures = require("../../utils/apiFeatures");

// Create a comment
const createCommentCtrl = expressAsyncHandler(async (req, res) => {
  console.log(req.user);
  try {
    const comment = await Comment.create({
      rating: req?.body?.rating,
      comment: req?.body?.comment,
      user: req?.user?.id,
      post: req?.body?.postId,
    });
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

// Fetch all comments
const fetchAllCommentsCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const features = new APIFeatures(Comment.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const comments = await features.query;
    res.json({ quantity: comments.length, comments });
  } catch (error) {
    res.json(error);
  }
});

// Fetch a comment
const fetchCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const comment = await Comment.findById(id);
    res.json(comment);
  } catch (error) {
    res.json(error);
  }
});

// Comment update
const updateCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const currentComment = await Comment.findById(id);
    if (!currentComment) {
      res.json("No comment found");
    }
    if (req.user.id === currentComment.user.toString() || req.user.isAdmin) {
      const update = await Comment.findByIdAndUpdate(
        id,
        {
          comment: req?.body?.comment,
          rating: req?.body?.rating,
        },
        { new: true, runValidators: true }
      );
      res.json(update);
    } else {
      res.json("You do not have permission to access this api");
    }
  } catch (error) {
    res.json(error);
  }
});

// Delete a comment
const deleteCommentCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const currentComment = await Comment.findById(id);
    if (!currentComment) {
      res.json("No comment found");
    }
    if (req.user.id === currentComment.user.toString() || req.user.isAdmin) {
      const comment = await Comment.findByIdAndDelete(id);
      res.json(comment);
    } else {
      res.json("You do not have permission to access this api");
    }
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCommentCtrl,
  fetchAllCommentsCtrl,
  fetchCommentCtrl,
  updateCommentCtrl,
  deleteCommentCtrl,
};

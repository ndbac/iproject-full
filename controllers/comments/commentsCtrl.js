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

module.exports = {
  createCommentCtrl,
};

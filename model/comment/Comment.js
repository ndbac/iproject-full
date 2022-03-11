const mongoose = require("mongoose");
const Post = require("../post/Post");

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "Comment must belong to a post"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Comment must belong to a user"],
    },
    comment: {
      type: String,
      required: [true, "Comment cannot be empty"],
    },
    rating: {
      type: Number,
      max: 5,
      min: 1,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

// Populate user when fetching
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "lastName firstName profilePhoto",
  });
  next();
});

// Calculating rating
commentSchema.statics.calcAverageRating = async function (postId) {
  const stats = await this.aggregate([
    { $match: { post: postId } },
    {
      $group: {
        _id: "$post",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  console.log(stats);

  if (stats.length > 0) {
    await Post.findByIdAndUpdate(postId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Post.findByIdAndUpdate(postId, {
      ratingsQuantity: 0,
      ratingsAverage: 5,
    });
  }
};

commentSchema.post("save", function (next) {
  this.constructor.calcAverageRating(this.post);
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;

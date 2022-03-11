const mongoose = require("mongoose");
const slugify = require("slugify");
const crypto = require("crypto");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      maxlength: [40, "Post title must have less or equal than 40 characters"],
      minLength: [10, "Post title must be at least 10 characters"],
      trim: true,
    },
    slug: String,
    category: {
      type: String,
      required: [true, "Post category is required"],
    },
    numViews: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: [true, "Post description is required"],
    },
    image: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2020/10/25/09/23/seagull-5683637_960_720.jpg",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
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

// Populate comments
postSchema.virtual("comments", {
  ref: "Comment",
  foreignField: "post",
  localField: "_id",
});

// Creating slug for post
postSchema.pre("save", function (next) {
  this.slug =
    slugify(this.title, { lower: true }) +
    "-" +
    crypto.randomBytes(1).toString("hex");
  next();
});
const Post = mongoose.model("Post", postSchema);

module.exports = Post;

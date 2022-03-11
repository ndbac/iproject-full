const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Category must be created by a user"],
    },
    title: {
      type: String,
      unique: true,
      required: [true, "Title is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Populate user when fetching
categorySchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "lastName firstName profilePhoto",
  });
  next();
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;

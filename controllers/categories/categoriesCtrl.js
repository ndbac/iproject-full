const expressAsyncHandler = require("express-async-handler");
const Category = require("../../model/category/Category");
const validateMongoDbId = require("../../utils/validateMongoDbId");

// Create a category
const createCategoryCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const isExists = await Category.findOne({ title: req?.body?.title });
    if (isExists) {
      res.json("This category is already exists");
    }
    const category = await Category.create({
      user: req?.user?._id,
      title: req?.body?.title,
    });
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

// Fetch all categories
const fetchCategoriesCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.json(error);
  }
});

// Fetch a category
const fetchCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

// Update a category
const updateCategoryCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        title: req?.body?.title,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

// Delete a category
const deleteCategory = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const category = await Category.findByIdAndDelete(id);
    res.json(category);
  } catch (error) {
    res.json(error);
  }
});

module.exports = {
  createCategoryCtrl,
  fetchCategoriesCtrl,
  fetchCategoryCtrl,
  updateCategoryCtrl,
  deleteCategory,
};

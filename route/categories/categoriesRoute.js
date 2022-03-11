const express = require("express");
const {
  createCategoryCtrl,
  fetchCategoriesCtrl,
  fetchCategoryCtrl,
  updateCategoryCtrl,
  deleteCategory,
} = require("../../controllers/categories/categoriesCtrl");
const {
  authMiddleware,
  adminAuthMiddleware,
} = require("../../middlewares/auth/authMiddleware");

const categoryRoute = express.Router();

categoryRoute.post("/", adminAuthMiddleware, createCategoryCtrl);

categoryRoute.put("/:id", adminAuthMiddleware, updateCategoryCtrl);

categoryRoute.get("/", fetchCategoriesCtrl);
categoryRoute.get("/:id", fetchCategoryCtrl);

categoryRoute.delete("/:id", adminAuthMiddleware, deleteCategory);

module.exports = categoryRoute;

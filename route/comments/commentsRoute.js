const express = require("express");

const {
  createCommentCtrl,
} = require("../../controllers/comments/commentsCtrl");
const {
  authMiddleware,
  adminAuthMiddleware,
} = require("../../middlewares/auth/authMiddleware");

const commentRoutes = express.Router();

commentRoutes.post("/", authMiddleware, createCommentCtrl);

module.exports = commentRoutes;

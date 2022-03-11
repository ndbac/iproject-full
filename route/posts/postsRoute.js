const express = require("express");
const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
  searchingPostsCtrl,
} = require("../../controllers/posts/postCtrl");
const {
  authMiddleware,
  adminAuthMiddleware,
} = require("../../middlewares/auth/authMiddleware");
const {
  photoUpload,
  postImgResize,
} = require("../../middlewares/upload/photoUpload");

const postRoute = express.Router();

postRoute.post(
  "/",
  authMiddleware,
  // photoUpload.single("image"),
  // postImgResize,
  createPostCtrl
);

postRoute.get("/", fetchPostsCtrl);
postRoute.get("/search", searchingPostsCtrl);
postRoute.get("/:id", fetchPostCtrl);

postRoute.put("/:id", authMiddleware, updatePostCtrl);

postRoute.delete("/:id", authMiddleware, deletePostCtrl);

module.exports = postRoute;

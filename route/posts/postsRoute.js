const express = require("express");
const {
  createPostCtrl,
  fetchPostsCtrl,
  fetchPostCtrl,
  updatePostCtrl,
  deletePostCtrl,
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
  //   photoUpload.single("image"),
  //   postImgResize,
  createPostCtrl
);

postRoute.get("/", fetchPostsCtrl);
postRoute.get("/:slug", fetchPostCtrl);

postRoute.put("/:slug", authMiddleware, updatePostCtrl);

postRoute.delete("/:slug", authMiddleware, deletePostCtrl);

module.exports = postRoute;

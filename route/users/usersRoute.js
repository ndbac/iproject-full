const express = require("express");
const {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUserCtrl,
  fetchUserDetailsCtrl,
  userProfileCtrl,
  updateUserPasswordCtrl,
  blockUserCtrl,
  unBlockUserCtrl,
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  forgetPasswordTokenCtrl,
  passwordResetCtrl,
  profilePhotoUploadCtrl,
} = require("../../controllers/users/usersCtrl");
const {
  authMiddleware,
  adminAuthMiddleware,
} = require("../../middlewares/auth/authMiddleware");
const {
  photoUpload,
  profilePhotoResize,
} = require("../../middlewares/upload/photoUpload");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.post("/password", authMiddleware, updateUserPasswordCtrl);
userRoutes.post(
  "/generate-verify-email-token",
  authMiddleware,
  generateVerificationTokenCtrl
);
userRoutes.post("/forget-password-token", forgetPasswordTokenCtrl);

userRoutes.get("/", adminAuthMiddleware, fetchUsersCtrl);
userRoutes.get("/:id", adminAuthMiddleware, fetchUserDetailsCtrl);
userRoutes.get("/profile/:id", userProfileCtrl);

userRoutes.put("/block-user/:id", adminAuthMiddleware, blockUserCtrl);
userRoutes.put("/unblock-user/:id", adminAuthMiddleware, unBlockUserCtrl);
userRoutes.put("/verify-account", accountVerificationCtrl);
userRoutes.put("/reset-password", passwordResetCtrl);
userRoutes.put(
  "/profilephoto-upload",
  authMiddleware,
  photoUpload.single("image"),
  profilePhotoResize,
  profilePhotoUploadCtrl
);

userRoutes.delete("/:id", adminAuthMiddleware, deleteUserCtrl);

module.exports = userRoutes;

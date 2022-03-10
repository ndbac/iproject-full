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
} = require("../../controllers/users/usersCtrl");
const authMiddleware = require("../../middlewares/auth/authMiddleware");
const adminChecking = require("../../middlewares/auth/adminChecking");

const userRoutes = express.Router();

userRoutes.post("/register", userRegisterCtrl);
userRoutes.post("/login", loginUserCtrl);
userRoutes.post("/password", authMiddleware, updateUserPasswordCtrl);

userRoutes.get("/", adminChecking, fetchUsersCtrl);
userRoutes.get("/:id", adminChecking, fetchUserDetailsCtrl);
userRoutes.get("/profile/:id", userProfileCtrl);

userRoutes.put("/block-user/:id", adminChecking, blockUserCtrl);
userRoutes.put("/unblock-user/:id", adminChecking, unBlockUserCtrl);

userRoutes.delete("/:id", adminChecking, deleteUserCtrl);

module.exports = userRoutes;

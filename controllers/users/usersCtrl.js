const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../../config/token/generateToken");
const User = require("../../model/user/User");
const validateMongoDbId = require("../../utils/validateMongoDbId");

//Register
const userRegisterCtrl = expressAsyncHandler(async (req, res) => {
  // Checking if the user is already registered
  const isExists = await User.findOne({ email: req?.body?.email });
  if (isExists) {
    throw new Error("This email is already registered");
  }

  //Register the user
  try {
    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

//Login
const loginUserCtrl = expressAsyncHandler(async (req, res) => {
  const { email, password } = req?.body;
  const userExists = await User.findOne({ email });
  if (userExists && (await userExists.comparePassword(password))) {
    const data = {
      _id: userExists?._id,
      firstName: userExists?.firstName,
      lastName: userExists?.lastName,
      email: userExists?.email,
      profilePhoto: userExists?.profilePhoto,
      isAdmin: userExists?.isAdmin,
      isVerified: userExists?.isAccountVerified,
    };
    res.json({
      token: generateToken(data),
    });
  } else {
    res.status(401);
    throw new Error("Email or password is incorrect");
  }
});

//Fetch all users
const fetchUsersCtrl = expressAsyncHandler(async (req, res) => {
  try {
    const users = await User.find({});
    res.json({
      Quantity: users.length,
      users,
    });
  } catch (error) {
    res.json(error);
  }
});

// Delete a user
const deleteUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  // Checking validate user
  validateMongoDbId(id);
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.json(deletedUser);
  } catch (error) {
    res.json(error);
  }
});

// User details for admin
const fetchUserDetailsCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id);
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

// User profile
const userProfileCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const user = await User.findById(id).select(
      "-password -email -_id -isAccountVerified -updatedAt -id -__v"
    );
    res.json(user);
  } catch (error) {
    res.json(error);
  }
});

// Update password
const updateUserPasswordCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { oldPassword, password } = req.body;
  validateMongoDbId(_id);

  const user = await User.findById(_id);

  if (password && (await user.comparePassword(oldPassword))) {
    user.password = password;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    throw new Error("Old password is incorrect");
  }
});

// Block user
const blockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const user = await User.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true }
  );
  res.json(user);
});

// Unblock user
const unBlockUserCtrl = expressAsyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  const user = await User.findByIdAndUpdate(
    id,
    { isBlocked: false },
    { new: true }
  );
  res.json(user);
});

module.exports = {
  userRegisterCtrl,
  loginUserCtrl,
  fetchUsersCtrl,
  deleteUserCtrl,
  fetchUserDetailsCtrl,
  userProfileCtrl,
  updateUserPasswordCtrl,
  blockUserCtrl,
  unBlockUserCtrl,
};

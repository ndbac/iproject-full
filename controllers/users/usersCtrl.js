const expressAsyncHandler = require("express-async-handler");
const crypto = require("crypto");
const fs = require("fs");

const generateToken = require("../../config/token/generateToken");
const User = require("../../model/user/User");
const validateMongoDbId = require("../../utils/validateMongoDbId");
const sendEmail = require("../../utils/mailing");
const cloudinaryUploadImg = require("../../utils/cloudinary");
const APIFeatures = require("../../utils/apiFeatures");

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
    const users = await User.find({}).populate({
      path: "posts",
      select: "_id -user",
    });
    res.json({
      quantity: users.length,
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
      "-password -email -_id -isAccountVerified -updatedAt -id -__v -passwordChangeAt -passwordResetToken -passwordResetExpires"
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

// Generate email verification token
const generateVerificationTokenCtrl = expressAsyncHandler(async (req, res) => {
  const loginUserId = req.user.id;
  const user = await User.findById(loginUserId);

  try {
    // Generate token
    const verificationToken = await user?.createAccountVerificationToken();
    await user.save();

    const data = {
      to: user?.email,
      subject: "Account verification step in iProject",
      message: `Click this verification link (within 10 minutes) to verify your account in iProject:
                http://localhost:5000/verify-account/${verificationToken}`,
    };

    await sendEmail(data);

    res.json({ Status: "Email sent" });
  } catch (error) {
    throw new Error(error);
  }
});

// Account verification
const accountVerificationCtrl = expressAsyncHandler(async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const userFound = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpires: { $gt: new Date() },
  });

  if (!userFound) {
    throw new Error("The verify link is out of date");
  }

  userFound.isAccountVerified = true;
  userFound.accountVerificationToken = undefined;
  userFound.accountVerificationTokenExpires = undefined;
  await userFound.save();
  res.json(userFound);
});

// Forgot password token generate
const forgetPasswordTokenCtrl = expressAsyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  try {
    const token = await user.createPasswordResetToken();
    await user.save();

    const data = {
      to: email,
      subject: "Account verification step in iProject",
      message: `Click this verification link (within 10 minutes) to verify your account in iProject:
                http://localhost:5000/reset-password/${token}`,
    };

    await sendEmail(data);

    res.json({ Status: "Email sent" });
  } catch (error) {
    throw new Error(error);
  }
});

// Password reset
const passwordResetCtrl = expressAsyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new Error("Reset password link is out of date");
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

// Profile photo upload
const profilePhotoUploadCtrl = expressAsyncHandler(async (req, res) => {
  const { _id } = req.user;
  // Get the path to the image
  const localPath = `public/images/profile/${req.file.filename}`;
  // Upload to cloudinary
  const imgUploaded = await cloudinaryUploadImg(localPath);

  const foundUser = await User.findByIdAndUpdate(
    _id,
    { profilePhoto: imgUploaded?.url },
    { new: true }
  );
  // Remove uploaded photo from storage
  fs.unlinkSync(localPath);
  res.json(imgUploaded);
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
  generateVerificationTokenCtrl,
  accountVerificationCtrl,
  forgetPasswordTokenCtrl,
  passwordResetCtrl,
  profilePhotoUploadCtrl,
};

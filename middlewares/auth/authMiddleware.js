const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../model/user/User");

// Checking if user logged
const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const rawData = jwt.verify(token, process.env.JWT_KEY);
        const { data } = rawData;

        // Check if user still exists
        const currentUser = await User.findById(data?._id).select("-password");
        if (!currentUser) {
          throw new Error("The user belonging to this token no longer exists");
        }

        // Check if user changed password after the JWT was issued
        if (currentUser.changePasswordAfter(rawData.iat)) {
          throw new Error(
            "This user recently change password. Please login again"
          );
        }

        // Attach the user to the request object
        req.user = currentUser;
        next();
      } else {
        throw new Error("There is no token attach to the headers");
      }
    } catch (error) {
      throw new Error(error);
    }
  }
});

// Checking if user is admin
const adminAuthMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const rawData = jwt.verify(token, process.env.JWT_KEY);
        const { data } = rawData;

        // Check if user still exists
        const currentUser = await User.findById(data?._id).select("-password");
        if (!currentUser) {
          throw new Error("The user belonging to this token no longer exists");
        }

        // Check if user changed password after the JWT was issued
        if (currentUser.changePasswordAfter(rawData.iat)) {
          throw new Error(
            "This user recently change password. Please login again"
          );
        }

        if (!currentUser?.isAdmin) {
          throw new Error("You do not have permission to access this api");
        } else {
          // Attach the user to the request object
          req.user = currentUser;
          next();
        }
      } else {
        throw new Error("There is no token attach to the headers");
      }
    } catch (error) {
      throw new Error(error);
    }
  }
});

module.exports = {
  authMiddleware,
  adminAuthMiddleware,
};

const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../../model/user/User");

const authMiddleware = expressAsyncHandler(async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization?.split(" ")[1];

      if (token) {
        const { data } = jwt.verify(token, process.env.JWT_KEY);
        // Find the user by id
        const user = await User.findById(data?._id).select("-password");
        // Attach the user to the request object
        req.user = user;
        next();
      } else {
        throw new Error("There is no token attach to the headers");
      }
    } catch (error) {
      throw new Error(error);
    }
  }
});

module.exports = authMiddleware;

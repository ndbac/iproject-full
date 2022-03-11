const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");

const dbConnect = require("./config/db/dbConnect");
const userRoutes = require("./route/users/usersRoute");
const postRoute = require("./route/posts/postsRoute");
const commentRoutes = require("./route/comments/commentsRoute");
const categoryRoute = require("./route/categories/categoriesRoute");
const emailMsgRoute = require("./route/emailMsg/emailMsgRoute");

const app = express();

// Database connection
dbConnect();
app.get("/", (req, res) => {
  res.json({ msg: "API for iProject" });
});

// Middlewares
app.use(express.json());
app.use(cors());

// Users route
app.use("/api/users", userRoutes);

// Posts route
app.use("/api/posts", postRoute);

// Comments route
app.use("/api/comments", commentRoutes);

// Categories route
app.use("/api/categories", categoryRoute);

// Mailing route
app.use("/api/mailing", emailMsgRoute);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running ${PORT}`));

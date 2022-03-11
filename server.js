const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

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
// Set security HTTP headers
app.use(helmet());
// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());

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

app.all("*", (req, res) => {
  res.json(`Can't find ${req.originalUrl} on this server!`);
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running ${PORT}`));

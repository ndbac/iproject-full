const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const dbConnect = require("./config/db/dbConnect");
const userRoutes = require("./route/users/usersRoute");

const app = express();

// Database connection
dbConnect();
app.get("/", (req, res) => {
  res.json({ msg: "API for iProject" });
});

// Middlewares
app.use(express.json());
app.use(cors());

//Users route
app.use("/api/users", userRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server is running ${PORT}`));

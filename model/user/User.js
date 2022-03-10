const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Create schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      required: [true, "First name is required"],
      type: "string",
    },
    lastName: {
      required: [true, "Last name is required"],
      type: "string",
    },
    profilePhoto: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    profileDescription: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    postQuantity: {
      type: Number,
      default: 0,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
  }
);

// Hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  // Hashing
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// UnHashing password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

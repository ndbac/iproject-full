const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

// Storage
const multerStorage = multer.memoryStorage();

// Checking type of file
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file type: " + file.mimeType }, false);
  }
};

const photoUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 4000084 },
});

// Image resizing
const profilePhotoResize = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(path.join(`public/images/profile/${req.file.filename}`));

  next();
};

module.exports = { photoUpload, profilePhotoResize };

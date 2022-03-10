const mongoose = require("mongoose");

const validateMongoDbId = (id) => {
  const isValid = mongoose.Types.ObjectId.isValid(id);
  if (!isValid) {
    throw new Error("The ID is not valid or found");
  }
};

module.exports = validateMongoDbId;

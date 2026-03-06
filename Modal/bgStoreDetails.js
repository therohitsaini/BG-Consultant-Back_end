const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: Number,
    username: String,
    email: String,
  },
  { _id: false },
);

const ownerSchema = new mongoose.Schema(
  {
    id: Number,
    username: String,
    email: String,
  },
  { _id: false },
);

const bigCommerceSchema = new mongoose.Schema(
  {
    store_hash: {
      type: String,
      required: true,
    },
    access_token: {
      type: String,
      required: true,
    },
    user: userSchema,
    owner: ownerSchema,
    account_uuid: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const bgStoreDetails = mongoose.model("BigCommerceStore", bigCommerceSchema);
module.exports = { bgStoreDetails };
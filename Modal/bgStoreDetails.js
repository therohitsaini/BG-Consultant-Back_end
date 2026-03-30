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
    adminPersenTage: {
      type: Number,
      default: 0,
      required: true,
    },
    appEnabled: {
      type: Boolean,
      default: false,
      required: true,
    },
    appBillingStatus: {
      type: String,
      default: "inactive",
      required: true,
    },
    user: userSchema,
    owner: ownerSchema,
    account_uuid: {
      type: String,
    },
    domain: {
      type: String,
    },
    secure_url: {
      type: String,
    },
    
    created_page_ids: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

const bgStoreDetails = mongoose.model("BigCommerceStore", bigCommerceSchema);
module.exports = { bgStoreDetails };

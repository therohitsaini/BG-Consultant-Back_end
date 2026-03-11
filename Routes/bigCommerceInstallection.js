const express = require("express");
const bigCommerceInstallationRoute = express.Router();
const {
  installBigCommerce,
  loadBigCommerce,

  unistalledBgCommerceApp,
} = require("../Controller/bigCommerceInstallectionController");

bigCommerceInstallationRoute.get("/auth", installBigCommerce);
bigCommerceInstallationRoute.get("/load", loadBigCommerce);
bigCommerceInstallationRoute.get("/uninstall",unistalledBgCommerceApp)
bigCommerceInstallationRoute.get("/verify-admin/store", verifyBigCommerceAdmin);
module.exports = { bigCommerceInstallationRoute };

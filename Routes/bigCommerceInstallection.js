const express = require("express");
const bigCommerceInstallationRoute = express.Router();
const {
  installBigCommerce,
  loadBigCommerce,

  unistalledBgCommerceApp,
  verifyBigCommerceAdmin,
} = require("../Controller/bigCommerceInstallectionController");
const {
  bgVerifyToken,
} = require("../MiddleWare/ShopifyMiddleware/bgVerifyToken");

bigCommerceInstallationRoute.get("/auth", installBigCommerce);
bigCommerceInstallationRoute.get("/load", loadBigCommerce);
bigCommerceInstallationRoute.get("/uninstall", unistalledBgCommerceApp);
bigCommerceInstallationRoute.get(
  "/verify-admin/store",
  bgVerifyToken,
  verifyBigCommerceAdmin,
);
module.exports = { bigCommerceInstallationRoute };

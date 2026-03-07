const express = require("express");
const bigCommerceInstallationRoute = express.Router();
const {
  installBigCommerce,
  loadBigCommerce,
  test,
} = require("../Controller/bigCommerceInstallectionController");

bigCommerceInstallationRoute.get("/auth", installBigCommerce);
bigCommerceInstallationRoute.get("/load", loadBigCommerce);
bigCommerceInstallationRoute.get("/test", test);

module.exports = { bigCommerceInstallationRoute };

const express = require("express");
const bigCommerceInstallationRoute = express.Router();
const {
  installBigCommerce,
  loadBigCommerce,
} = require("../Controller/bigCommerceInstallectionController");

bigCommerceInstallationRoute.get("/auth", installBigCommerce);
bigCommerceInstallationRoute.get("/load", loadBigCommerce);

module.exports = { bigCommerceInstallationRoute };

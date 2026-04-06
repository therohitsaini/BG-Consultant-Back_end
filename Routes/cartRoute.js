const express = require("express");
const cartRoute = express.Router();
const { createCartController } = require("../Controller/cartController");

cartRoute.post("/create-cart", createCartController);

module.exports = cartRoute;

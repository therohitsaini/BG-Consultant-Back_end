const express = require("express");
const createCartRoute = express.Router();

const {
  createBigCommerceCartController,
} = require("../Controller/bigCommerceCreateCartController");

// POST /api/create-cart
createCartRoute.post("/create-cart", createBigCommerceCartController);

module.exports = createCartRoute;


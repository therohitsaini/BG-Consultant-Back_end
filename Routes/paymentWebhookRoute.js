const express = require("express");
const stripeWebhookRoute = express.Router();
const { handleStripeWebhook } = require("../Controller/webhookController");

stripeWebhookRoute.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);

module.exports = stripeWebhookRoute;

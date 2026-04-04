const express = require("express");
const router = express.Router();
const webhookController = require("../Controller/webhookController");

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  webhookController.handleStripeWebhook,
);

module.exports = router;

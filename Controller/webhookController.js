const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { activateStorePlan } = require("../services/stripe.service");

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const store = session.metadata?.store;
    const plan = session.metadata?.plan;

    console.log("Payment Success:", store, plan);

    try {
      await activateStorePlan(store, plan);
    } catch (dbErr) {
      console.error("[handleStripeWebhook] activateStorePlan failed:", dbErr);
      return res.status(500).json({ received: false, error: "db_update_failed" });
    }
  }

  return res.status(200).json({ received: true });
};

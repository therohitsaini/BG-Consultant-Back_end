const Stripe = require("stripe");
const dotenv = require("dotenv");
dotenv.config();

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  return new Stripe(key);
}

/**
 * Maps request plan name to Stripe Price ID (configure in env).
 */
function getPriceIdForPlan(plan) {
  const normalized = String(plan || "").toLowerCase().trim();
  const map = {
    basic: process.env.STRIPE_PRICE_ID_BASIC,
    pro: process.env.STRIPE_PRICE_ID_PRO,
  };
  return map[normalized] || null;
}

/**
 * POST /create-session
 * Body: { plan: "basic" | "pro", store: string } — store is typically BigCommerce store_hash.
 */
const createCheckoutSession = async (req, res) => {
  try {
    const { plan, store } = req.body || {};

    if (store === undefined || store === null || String(store).trim() === "") {
      return res.status(400).json({
        success: false,
        message: "store is required in request body",
      });
    }

    const storeValue = String(store).trim();
    const normalizedPlan = String(plan || "").toLowerCase().trim();

    if (!normalizedPlan || (normalizedPlan !== "basic" && normalizedPlan !== "pro")) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan. Use "basic" or "pro".',
      });
    }

    const priceId = getPriceIdForPlan(normalizedPlan);
    if (!priceId) {
      return res.status(500).json({
        success: false,
        message:
          "Stripe price ID not configured for this plan. Set STRIPE_PRICE_ID_BASIC and STRIPE_PRICE_ID_PRO.",
      });
    }

    const successUrl =
      process.env.STRIPE_SUCCESS_URL ||
      "http://localhost:3000/?session_id={CHECKOUT_SESSION_ID}";
    const cancelUrl = process.env.STRIPE_CANCEL_URL || "http://localhost:3000/";

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        store: storeValue,
        plan: normalizedPlan,
      },
    });

    if (!session.url) {
      return res.status(500).json({
        success: false,
        message: "Checkout session created but no redirect URL returned",
      });
    }

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.error("Stripe create-session error:", error);
    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to create Stripe Checkout session",
    });
  }
};

module.exports = {
  createCheckoutSession,
  getStripe,
};

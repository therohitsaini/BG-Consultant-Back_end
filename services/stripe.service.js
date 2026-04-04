const { bgStoreDetails } = require("../Modal/bgStoreDetails");

/**
 * Activate store subscription after successful Stripe Checkout (checkout.session.completed).
 * @param {string} store - BigCommerce store_hash (must match metadata.store from Checkout)
 * @param {string} plan - Plan name from metadata.plan (e.g. basic, pro)
 */
async function activateStorePlan(store, plan) {
  if (!store || String(store).trim() === "") {
    console.warn(
      "[activateStorePlan] Missing store; skipping. plan:",
      plan,
    );
    return null;
  }

  const storeHash = String(store).trim();
  console.log("[activateStorePlan] Activating store:", storeHash, "plan:", plan);

  const updated = await bgStoreDetails.findOneAndUpdate(
    { store_hash: storeHash },
    {
      $set: {
        appStatus: "ACTIVE",
        appBillingStatus: "active",
        planName: plan,
     
      },
    },
    { new: true },
  );

  if (!updated) {
    console.warn(
      "[activateStorePlan] No BigCommerce store found for store_hash:",
      storeHash,
    );
    return null;
  }

  console.log("[activateStorePlan] Store activated:", storeHash);
  return updated;
}

module.exports = {
  activateStorePlan,
};

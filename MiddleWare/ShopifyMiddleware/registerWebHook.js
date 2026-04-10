const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

const registerWebhook = async (storeHash, accessToken) => {
  console.log("web hook is registered .....");
  try {
    const headers = {
      "X-Auth-Token": accessToken,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    const existingHooks = await axios.get(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/hooks`,
      { headers },
    );

    const alreadyExists = existingHooks.data.data.find(
      (hook) =>
        hook.scope === "store/order/created" &&
        hook.destination ===
          `${BIG_COMERCE_BACEKND_DOMAIN}/webhook/order-created`,
    );

    if (alreadyExists) {
      console.log("Webhook already exists");
      return alreadyExists;
    }

    const response = await axios.post(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/hooks`,
      {
        scope: "store/order/created",
        destination: `${BIG_COMERCE_BACEKND_DOMAIN}/webhook/order-created`,
        is_active: true,
      },
      { headers },
    );

    console.log("✅ Webhook registered:", response.data);

    return response.data;
  } catch (error) {
    console.error("❌ Webhook error:", error?.response?.data || error.message);
    throw error;
  }
};

module.exports = registerWebhook;

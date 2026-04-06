const axios = require("axios");
const dotenv = require("dotenv");
const { bgStoreDetails } = require("../Modal/bgStoreDetails");

dotenv.config();

/**
 * Create a BigCommerce cart for a given product and return the cart/checkout URL.
 * Body: { productId: number, storeHash: string }
 */
const createBigCommerceCartController = async (req, res) => {
  try {
    const { productId, storeHash } = req.body || {};

    // Validate input
    if (productId === undefined || productId === null) {
      return res.status(400).json({
        success: false,
        message: "productId must exist",
      });
    }

    const parsedProductId = Number(productId);
    if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
      return res.status(400).json({
        success: false,
        message: "productId must be a valid positive integer",
      });
    }

    if (!storeHash || typeof storeHash !== "string" || !storeHash.trim()) {
      return res.status(400).json({
        success: false,
        message: "storeHash must exist",
      });
    }

    const trimmedStoreHash = storeHash.trim();

    // Fetch access token from DB (never accept accessToken from frontend)
    const store = await bgStoreDetails
      .findOne({ store_hash: trimmedStoreHash })
      .lean();

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found for provided storeHash",
      });
    }

    if (!store.access_token) {
      return res.status(400).json({
        success: false,
        message: "BigCommerce access token missing for this store",
      });
    }

    const accessToken = store.access_token;

    const url = `https://api.bigcommerce.com/stores/${encodeURIComponent(
      trimmedStoreHash,
    )}/v3/carts`;

    const requestBody = {
      line_items: [
        {
          quantity: 1,
          product_id: parsedProductId,
        },
      ],
    };

    const bigCommerceResponse = await axios.post(url, requestBody, {
      headers: {
        "X-Auth-Token": accessToken,
        "Content-Type": "application/json",
      },
    });

    const payload = bigCommerceResponse?.data?.data ?? bigCommerceResponse?.data;
    const checkoutUrl =
      payload?.channel?.cart_url ||
      payload?.cart_url ||
      payload?.channel?.url ||
      payload?.checkout_url ||
      payload?.checkoutUrl ||
      payload?.url ||
      null;

    if (!checkoutUrl) {
      return res.status(502).json({
        success: false,
        message: "Cart created, but checkoutUrl was not found in BigCommerce response",
      });
    }

    return res.status(200).json({
      success: true,
      checkoutUrl,
    });
  } catch (error) {
    const statusCode = error.response?.status || 500;
    const apiErrors =
      error.response?.data?.errors || error.response?.data?.error || null;

    const apiMessage =
      error.response?.data?.message ||
      (Array.isArray(apiErrors) ? apiErrors[0]?.message : null) ||
      error.message ||
      "Failed to create BigCommerce cart";

    return res.status(statusCode).json({
      success: false,
      message: apiMessage,
      details: apiErrors || error.response?.data || undefined,
    });
  }
};

module.exports = { createBigCommerceCartController };


const axios = require("axios");
const { bgStoreDetails } = require("../Modal/bgStoreDetails");

// const createCartController = async (req, res) => {
//   try {
//     const { productId, shopId } = req.body || {};

//     if (productId === undefined || productId === null) {
//       return res.status(400).json({
//         success: false,
//         message: "productId must exist",
//       });
//     }

//     const parsedProductId = Number(productId);
//     if (!Number.isInteger(parsedProductId) || parsedProductId <= 0) {
//       return res.status(400).json({
//         success: false,
//         message: "productId must be a valid positive integer",
//       });
//     }

//     if (!shopId || typeof shopId !== "string" || !shopId.trim()) {
//       return res.status(400).json({
//         success: false,
//         message: "shopId must exist",
//       });
//     }

//     const trimmedShopId = shopId.trim();

//     const storeData = await bgStoreDetails
//       .findOne({ _id: trimmedShopId })
//       .lean();

//     if (!storeData) {
//       return res.status(404).json({
//         success: false,
//         message: "Store not found for provided shopId",
//       });
//     }

//     const accessToken = storeData.access_token;
//     const storeHash = storeData.store_hash;
//     if (!accessToken) {
//       return res.status(400).json({
//         success: false,
//         message: "BigCommerce access token missing for this store",
//       });
//     }

//     const response = await axios.post(
//       `https://api.bigcommerce.com/stores/${encodeURIComponent(
//         storeHash,
//       )}/v3/carts`,
//       {
//         line_items: [
//           {
//             product_id: parsedProductId,
//             quantity: 1,
//           },
//         ],
//       },
//       {
//         headers: {
//           "X-Auth-Token": accessToken,
//           "Content-Type": "application/json",
//         },
//       },
//     );
//     console.log("response", response);
//     const cartId = response?.data?.data?.id;
//     console.log("cartId", cartId);
//     const checkoutResponse = await axios.get(
//       `https://api.bigcommerce.com/stores/${storeHash}/v3/checkouts/${cartId}`,
//       {
//         headers: {
//           "X-Auth-Token": accessToken,
//           "Content-Type": "application/json",
//         },
//       },
//     );
//     console.log("checkoutResponse", checkoutResponse);
//     const checkoutUrl = `https://store-${storeHash}.mybigcommerce.com/cart.php?action=loadInCheckout&id=${cartId}`;
//     console.log("checkoutUrl", checkoutUrl);

//     res.json({
//       checkoutUrl,
//       success: true,
//     });
//   } catch (err) {
//     const statusCode = err.response?.status || 500;
//     const contentType = err.response?.headers?.["content-type"] || "";

//     // BigCommerce normally returns JSON, but on some edge cases you may get HTML (openresty).
//     const rawData = err.response?.data;
//     const details =
//       typeof rawData === "string" && contentType.includes("text/html")
//         ? rawData.slice(0, 500)
//         : rawData;

//     console.error(details || err.message);
//     res.status(statusCode).json({
//       success: false,
//       message:
//         err.response?.data?.title ||
//         err.response?.data?.message ||
//         err.message ||
//         "Failed to create BigCommerce cart",
//       details,
//     });
//   }
// };

// const createCartController = async (req, res) => {
//   try {
//     const { productId, shopId } = req.body || {};

//     if (!productId) {
//       return res.status(400).json({
//         success: false,
//         message: "productId must exist",
//       });
//     }

//     if (!shopId) {
//       return res.status(400).json({
//         success: false,
//         message: "shopId must exist",
//       });
//     }

//     const storeData = await bgStoreDetails.findOne({ _id: shopId }).lean();

//     if (!storeData) {
//       return res.status(404).json({
//         success: false,
//         message: "Store not found",
//       });
//     }

//     const storeHash = storeData.store_hash;
//     const checkoutUrl = `https://store-${storeHash}.mybigcommerce.com/cart.php?action=add&product_id=${productId}`;
//     console.log("checkoutUrl", checkoutUrl);

//     const cartResponse = await axios.post(
//       `https://api.bigcommerce.com/stores/${storeHash}/v3/carts`,
//       {
//         line_items: [
//           {
//             product_id: productId,
//             quantity: 1,
//           },
//         ],
//       },
//       {
//         headers: {
//           "X-Auth-Token": storeData.access_token,
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     const cartId = cartResponse.data.data.id;
//     console.log("checkoutUrl_", cartId);
//     return res.json({
//       success: true,
//       checkoutUrl,
//     });
//   } catch (err) {
//     console.error(err.message);

//     res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//     });
//   }
// };

// const createCartController = async (req, res) => {
//   try {
//     const { productId, shopId, quantity = 1 } = req.body || {};

//     // ✅ Validation
//     if (!productId) {
//       return res.status(400).json({
//         success: false,
//         message: "productId is required",
//       });
//     }

//     if (!shopId) {
//       return res.status(400).json({
//         success: false,
//         message: "shopId is required",
//       });
//     }

//     // ✅ Get store data from DB
//     const storeData = await bgStoreDetails.findOne({ _id: shopId }).lean();

//     if (!storeData) {
//       return res.status(404).json({
//         success: false,
//         message: "Store not found",
//       });
//     }

//     const storeHash = storeData.store_hash;
//     const accessToken = storeData.access_token;

//     // ✅ Create cart using BigCommerce API
//     const cartResponse = await axios.post(
//       `https://api.bigcommerce.com/stores/${storeHash}/v3/carts`,
//       {
//         line_items: [
//           {
//             product_id: productId,
//             quantity: quantity,
//           },
//         ],
//       },
//       {
//         headers: {
//           "X-Auth-Token": accessToken,
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//       },
//     );

//     const cartData = cartResponse.data.data;

//     // ✅ IMPORTANT: Use redirect URL from API (this fixes empty cart issue)
//     const checkoutUrl = cartData.redirect_urls.checkout_url;

//     return res.status(200).json({
//       success: true,
//       message: "Cart created successfully",
//       cartId: cartData.id,
//       checkoutUrl,
//     });
//   } catch (error) {
//     console.error("Cart Error:", error?.response?.data || error.message);

//     return res.status(500).json({
//       success: false,
//       message: "Something went wrong",
//       error: error?.response?.data || error.message,
//     });
//   }
// };
const createCartController = async (req, res) => {
  try {
    const { productId, shopId, quantity = 1 } = req.body;

    // ✅ Validation
    if (!productId || !shopId) {
      return res.status(400).json({
        success: false,
        message: "productId and shopId are required",
      });
    }

    // ✅ Get store
    const storeData = await bgStoreDetails.findOne({ _id: shopId }).lean();

    if (!storeData) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const storeHash = storeData.store_hash;
    const token = storeData.access_token;

    // ================================
    // ✅ STEP 1: CREATE CART
    // ================================
    const cartRes = await axios.post(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/carts`,
      {
        line_items: [
          {
            product_id: productId,
            quantity,
          },
        ],
      },
      {
        headers: {
          "X-Auth-Token": token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    const cartData = cartRes.data.data;

    if (!cartData || !cartData.id) {
      throw new Error("Cart creation failed");
    }
    const cartId = cartData.id;
    const redirectRes = await axios.post(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/carts/${cartId}/redirect_urls`,
      {},
      {
        headers: {
          "X-Auth-Token": token,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    const redirectData = redirectRes.data.data;

    if (!redirectData || !redirectData.checkout_url) {
      throw new Error("Checkout URL not generated");
    }

    return res.status(200).json({
      success: true,
      cartId,
      checkoutUrl: redirectData.checkout_url,
      cartUrl: redirectData.cart_url,
    });
  } catch (error) {
    console.error("Cart Error:", error?.response?.data || error.message);

    return res.status(500).json({
      success: false,
      message: "Cart creation failed",
      error: error?.response?.data || error.message,
    });
  }
};

module.exports = { createCartController };

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

const createCartController = async (req, res) => {
  try {
    const { productId, shopId } = req.body || {};

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "productId must exist",
      });
    }

    if (!shopId) {
      return res.status(400).json({
        success: false,
        message: "shopId must exist",
      });
    }

    const storeData = await bgStoreDetails.findOne({ _id: shopId }).lean();

    if (!storeData) {
      return res.status(404).json({
        success: false,
        message: "Store not found",
      });
    }

    const storeHash = storeData.store_hash;
    const checkoutUrl = `https://store-${storeHash}.mybigcommerce.com/cart.php?action=add&product_id=${productId}`;
    console.log("checkoutUrl", checkoutUrl);

    const response = await axios.post(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/carts`,
      {
        line_items: [
          {
            product_id: productId,
            quantity: 1,
          },
        ],
      },
      {
        headers: {
          "X-Auth-Token": storeData.access_token,
          "Content-Type": "application/json",
        },
      },
    );

    const checkoutUrl_ = response?.data?.data?.redirect_urls?.checkout_url;
    console.log("checkoutUrl_", checkoutUrl_);
    return res.json({
      success: true,
      checkoutUrl,
    });
  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
module.exports = { createCartController };

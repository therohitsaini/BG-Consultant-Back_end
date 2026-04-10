const mongoose = require("mongoose");
const { User } = require("../Modal/userSchema");
const { bgStoreDetails } = require("../Modal/bgStoreDetails");
const axios = require("axios");
const usersController = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid admin ID",
      });
    }
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user",
    });
  }
};

const checkedUserBlance = async (req, res) => {
  try {
    const { userId, consultantId } = req.params;
    const { callType = "voice" } = req.query;

    const user = await User.findById(userId).select("walletBalance");
    const consultant = await User.findById(consultantId)
      .select("voicePerMinute videoPerMinute chatPerMinute")
      .lean();

    if (!user || !consultant) {
      return res.status(404).json({
        success: false,
        message: "User or consultant not found",
      });
    }

    let callCost = 0;

    if (callType === "chat") {
      callCost = consultant.chatPerMinute;
    } else if (callType === "voice") {
      callCost = consultant.voicePerMinute;
    } else if (callType === "video") {
      callCost = consultant.videoPerMinute;
    }

    if (!callCost) {
      return res.status(400).json({
        success: false,
        message: "Invalid call type",
      });
    }

    if (user.walletBalance < callCost) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        userBalance: user.walletBalance,
        callCost,
        callType,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const recivedBalanceUpdateWebhook = async (req, res) => {
  try {
    console.log("🔥 WEBHOOK HIT");
    const body = req.body;
    const context = body.producer;
    const storeHash = context.split("/")[1];
    const orderId = body.data.id;
    const accessToken = await bgStoreDetails.findOne({ store_hash: storeHash });
    const orderRes = await axios.get(
      `https://api.bigcommerce.com/stores/${storeHash}/v2/orders/${orderId}`,
      {
        headers: {
          "X-Auth-Token": accessToken.access_token,
          Accept: "application/json",
        },
      },
    );

    const order = orderRes.data;
    const findUser = await User.findOne({ cartId: order.cart_id });
    console.log("findUser", findUser);
    console.log("Full Order:", order);

    res.status(200).send("OK");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  usersController,
  checkedUserBlance,
  recivedBalanceUpdateWebhook,
};

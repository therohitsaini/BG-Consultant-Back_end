const jwt = require("jsonwebtoken");
const { User } = require("../Modal/userSchema");

const bgCommerceUserController = async (req, res) => {
  console.log("bgCommerceUserController");
  console.log("req.body", req.body);
  try {
    const token = req.body?.token;
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token missing",
      });
    }
    const decoded = jwt.decode(token);
    const customer = decoded;

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Customer not found in token",
      });
    }
    const user = await User.findOne({
      shopifyCustomerId: decoded?.customer?.id,
      email: decoded?.customer?.email,
    });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    } else {
      const newUser = new User({
        shopifyCustomerId: decoded?.customer?.id,
        email: decoded?.customer?.email,
        fullname:"Shopify Customer",
        userType: "customer",
        walletBalance: 0,
        isActive: false,
        isChatAccepted: "request",
        createdAt: decoded?.customer?.createdAt,
        numberOfOrders: decoded?.customer?.numberOfOrders,
        chatLock: true,
      });
      await newUser.save();
      return res.status(200).json({
        success: true,
        message: "User created successfully",
        user: newUser,
      });
    }
  } catch (error) {
    console.error("JWT Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { bgCommerceUserController };

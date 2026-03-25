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
    const customer = decoded?.customer;
    console.log("customer", decoded);
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Customer not found in token",
      });
    }

    let user = await User.findOne({
      bigcommerceCustomerId: customer.id,
      email: customer.email,
    });

    if (user) {
      return res.status(200).json({
        success: true,
        message: "User already exists",
        user,
      });
    } else {
      {
        const newUser = new User({
          bigcommerceCustomerId: customer.id,
          email: customer.email,
          fullname: "BigCommerce Customer",
          userType: "customer",
          walletBalance: 0,
          isActive: true,
          isChatAccepted: "request",
          createdAt: customer.date_created,
          numberOfOrders: customer.orders_count || 0,
          chatLock: true,
        });
        await newUser.save();
      }
      return res.status(201).json({
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

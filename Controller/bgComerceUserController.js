const jwt = require("jsonwebtoken");

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

    // ✅ DECODE ONLY (NOT VERIFY)
    const decoded = jwt.decode(token);

    console.log("decoded", decoded);

    const customer = decoded?.customer;

    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Customer not found in token",
      });
    }

    console.log("User:", customer);

    return res.json({
      success: true,
      user: customer,
    });

  } catch (error) {
    console.error("JWT Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { bgCommerceUserController };
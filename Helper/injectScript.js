const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const injectScript = async (storeHash, accessToken) => {
  try {
    const response = await axios.post(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/content/scripts`,
      {
        name: "React Storefront App",
        html: `<script src="https://${process.env.APP_URL}/embed.js"></script>`,
        location: "footer",
        kind: "src",
        auto_uninstall: true,
        load_method: "default",
      },
      {
        headers: {
          "X-Auth-Token": accessToken,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    console.log("Script Injected:", response.data);
  } catch (error) {
    console.error(
      "Script Injection Failed:",
      error.response?.data || error.message,
    );
  }
};

module.exports = { injectScript };

const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const injectScript = async (storeHash, accessToken) => {
  try {
    const response = await axios.post(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/content/scripts`,
      {
        name: "React Storefront App",
        src: `https://${process.env.APP_URL}/embed.js`,
        auto_uninstall: true,
        location: "footer",
        kind: "src",
        load_method: "default"
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

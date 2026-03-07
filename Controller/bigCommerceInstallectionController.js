const axios = require("axios");
const dotenv = require("dotenv");
const { bgStoreDetails } = require("../Modal/bgStoreDetails");
const crypto = require("crypto");
dotenv.config();

const BIGCOMMERCE_STORE_CLIENT_ID = process.env.BIGCOMMERCE_STORE_CLIENT_ID;
const BIGCOMMERCE_STORE_CLIENT_SECRET =
  process.env.BIGCOMMERCE_STORE_CLIENT_SECRET;

const installBigCommerce = async (req, res) => {
  console.log("installBigCommerce", req.query);
  try {
    const { code, context, scope } = req.query;

    console.log("code:", code);
    console.log("context:", context);
    console.log("scope:", scope);

    if (!code || !context) {
      return res.status(400).send("Invalid request");
    }

    const tokenResponse = await axios.post(
      "https://login.bigcommerce.com/oauth2/token",
      {
        client_id: BIGCOMMERCE_STORE_CLIENT_ID,
        client_secret: BIGCOMMERCE_STORE_CLIENT_SECRET,
        redirect_uri: "https://test-big-consultation.zend-apps.com/api/auth",
        grant_type: "authorization_code",
        code: code,
      },
    );

    const data = tokenResponse.data;
    console.log("TOKEN RESPONSE:", data);
    const accessToken = data.access_token;
    const storeHash = context.split("/")[1];

    const bgStore = await bgStoreDetails.create({
      store_hash: storeHash,
      access_token: accessToken,
      user: {
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
      },
      owner: {
        id: data.owner.id,
        email: data.owner.email,
        username: data.owner.username,
      },
      account_uuid: data.account_uuid,
    });
    console.log("BG STORE:", bgStore);
    res.send("BigCommerce App Installed Successfully");
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).send("Install failed");
  }
};

const loadBigCommerce = async (req, res) => {
  try {
    const { signed_payload } = req.query;

    if (!signed_payload) {
      return res.status(400).send("Missing payload");
    }
    const [encodedPayload, signature] = signed_payload.split(".");
    const payload = Buffer.from(encodedPayload, "base64").toString("utf8");

    console.log("ENCODED PAYLOAD:", encodedPayload);
    console.log("SIGNATURE:", signature);

    const expectedSignature = crypto
      .createHmac("sha256", BIGCOMMERCE_STORE_CLIENT_SECRET)
      .update(encodedPayload)
      .digest("base64");
    console.log("EXPECTED SIGNATURE:", expectedSignature);
    if (signature !== expectedSignature) {
      return res.status(401).send("Invalid signature");
    }

    const data = JSON.parse(payload);
    console.log(data);
    const storeHash = data.store_hash;

    res.redirect(
      `https://brown-cougars-yell.loca.lt/video/calling/page?store=${storeHash}`,
    );
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).send("Load failed");
  }
};

const test = async (req, res) => {
  try {
    res.send("Test successful");
  } catch (error) {
    console.log(error);
    res.status(500).send("Test failed");
  }
};

module.exports = {
  installBigCommerce,
  loadBigCommerce,
  test,
};

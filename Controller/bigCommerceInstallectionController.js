const axios = require("axios");
const dotenv = require("dotenv");
const { bgStoreDetails } = require("../Modal/bgStoreDetails");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
dotenv.config();

const BIGCOMMERCE_STORE_CLIENT_ID = process.env.BIGCOMMERCE_STORE_CLIENT_ID;
const BIGCOMMERCE_STORE_CLIENT_SECRET =
  process.env.BIGCOMMERCE_STORE_CLIENT_SECRET;

const installBigCommerce = async (req, res) => {
  try {
    const { code, context, scope } = req.query;

    if (!code || !context) {
      return res.status(400).send("Invalid request");
    }

    const tokenResponse = await axios.post(
      "https://login.bigcommerce.com/oauth2/token",
      {
        client_id: BIGCOMMERCE_STORE_CLIENT_ID,
        client_secret: BIGCOMMERCE_STORE_CLIENT_SECRET,
        redirect_uri: process.env.REDIRECT_URL,
        grant_type: "authorization_code",
        code: code,
      },
    );

    const data = tokenResponse.data;
    const accessToken = data.access_token;
    const storeHash = context.split("/")[1];

    await bgStoreDetails.create({
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

    res.redirect(
      `https://store-${storeHash}.mybigcommerce.com/admin/apps/${process.env.APP_ID}`,
    );
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).send("Install failed");
  }
};

const loadBigCommerce = async (req, res) => {
  try {
    const { signed_payload_jwt } = req.query;
    if (!signed_payload_jwt) {
      return res.status(400).send("Missing payload");
    }
    const decoded = jwt.verify(
      signed_payload_jwt,
      process.env.BIGCOMMERCE_STORE_CLIENT_SECRET,
    );
    const storeHash = decoded.sub.replace("stores/", "");

    res.redirect(`${process.env.APP_LOAD_URL}?store=${storeHash}`);
  } catch (err) {
    res.status(401).send("Invalid signature");
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

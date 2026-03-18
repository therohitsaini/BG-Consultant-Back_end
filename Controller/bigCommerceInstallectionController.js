const axios = require("axios");
const dotenv = require("dotenv");
const { bgStoreDetails } = require("../Modal/bgStoreDetails");
const { injectScript } = require("../Helper/injectScript");
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

   const store = await bgStoreDetails.create({
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
    const pageResponse = await axios.post(
      `https://api.bigcommerce.com/stores/${storeHash}/v3/content/pages`,
      {
        channel_id: 1,
        name: "Autodraw Consultant",
        is_visible: true,
        parent_id: 0,
        sort_order: 0,
        type: "page",
        body: `
       <div style="width: 100%;">
          <iframe 
            src="https://expert-occupational-definitely-sink.trycloudflare.com?store=${storeHash}&userId=${store?._id}" 
            id="consultant-iframe"
            style="width: 100%; border: none; overflow: hidden;" 
            scrolling="no"
          ></iframe>
        </div>

      <script>
        window.addEventListener('message', function(event) {
          // 1. Check if the message is from your React App
          if (event.data && event.data.type === 'AGORA_IFRAME_HEIGHT') {
            const iframe = document.getElementById('consultant-iframe');
            if (iframe) {
              // 2. Set the iframe height to exactly match the React content
              iframe.style.height = event.data.height + 'px';
            }
          }
        }, false);
      </script>
      `,
        is_homepage: false,
        search_keywords: "autodraw consultant",
        url: "/autodraw-consultant",
      },
      {
        headers: {
          "X-Auth-Token": accessToken,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    console.log("Page created successfully:", pageResponse.data);

    res.redirect(
      `https://store-${storeHash}.mybigcommerce.com/manage/apps/${process.env.APP_ID}`,
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

    res.redirect(`${process.env.APP_LOAD_URL}/#/admin?store=${storeHash}`);
  } catch (err) {
    res.status(401).send("Invalid signature");
  }
};

const unistalledBgCommerceApp = async (req, res) => {
  try {
    const { signed_payload } = req.query;

    const [encodedPayload] = signed_payload.split(".");
    const decoded = JSON.parse(
      Buffer.from(encodedPayload, "base64").toString("utf8"),
    );

    const store_hash = decoded.store_hash;

    const store = await bgStoreDetails.findOne({ store_hash });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    const email = store?.owner?.email || store?.user?.email;

    await bgStoreDetails.updateOne(
      { store_hash },
      {
        $set: {
          access_token: null,
          store_hash: null,
          user: {
            id: null,
            username: null,
            email: email,
          },
          owner: {
            id: null,
            username: null,
            email: email,
          },
          account_uuid: null,
        },
      },
    );

    res.status(200).json({
      success: true,
      email,
      message: "Data cleared except email",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Server error");
  }
};

const verifyBigCommerceAdmin = async (req, res) => {
  try {
    const { store } = req.query;
    console.log("store", store);
    const storeDetails = await bgStoreDetails.findOne({ store_hash: store });
    if (!storeDetails) {
      return res.status(404).json({ message: "Store not found" });
    }
    return res
      .status(200)
      .json({ message: "Store verified", data: storeDetails });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  installBigCommerce,
  loadBigCommerce,
  unistalledBgCommerceApp,
  verifyBigCommerceAdmin,
};

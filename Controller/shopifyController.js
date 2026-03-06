const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();
const { shopModel } = require("../Modal/shopify");
const {
  manageShopifyUser,
} = require("../MiddleWare/ShopifyMiddleware/handleShopifyUser");
const {
  renderShopifyPage,
} = require("../MiddleWare/ShopifyMiddleware/helperTheme");
const {
  registerAppUninstallWebhook,
} = require("../MiddleWare/ShopifyMiddleware/registerWebHook");

let axios, wrapper, CookieJar;
try {
  axios = require("axios");
  wrapper = require("axios-cookiejar-support").wrapper;
  CookieJar = require("tough-cookie").CookieJar;
} catch (e) {
  // Optional deps not installed; auto-login will be disabled
}

const frontendUrl = process.env.FRONTEND_URL;

/**
 * STEP 1: Shopify App Installation Function
 * Ye function tab call hota hai jab user Shopify store se app install karta hai
 * Flow:
 * 1. User Shopify Admin Panel se app install karta hai
 */

const appIsInstalled = async (req, res) => {
  const { shop } = req.params;
  console.log("shop____appIsInstalled", shop);
  if (!shop) return res.status(400).send("Missing shop param");
  const shopDoc = await shopModel.findOne({ shop: shop });
  console.log("shopDoc____appIsInstalled", shopDoc.accessToken);
  if (shopDoc.accessToken) {
    return res.status(200).send({
      installed: true,
    });
  } else {
    return res.status(200).send({
      installed: false,
    });
  }
};



/** Proxy for Shopify Theme Assets
 * 1. GET /apps/theme/header?shop=store.myshopify.com
 * 2. GET /apps/theme/footer?shop=store.myshopify.com
 */

const proxyThemeAssetsController = async (req, res) => {
  try {
    const shop = req.query.shop;
    const themeId = req.query.theme_id;
    const customerId = req.query.logged_in_customer_id;
    let userId;
    let token;
    if (shop && customerId) {
      try {
        const result = await manageShopifyUser(shop, customerId);
        userId = result;
        token = result.token;
        console.log("result", result);
        if (result.success) {
          console.log(
            "✅ Customer registration:",
            result.message,
            result.userId ? `userId: ${result.userId}` : "",
          );
        } else {
          console.log("⚠️ Customer registration failed:", result.message);
        }
      } catch (error) {
        console.error("❌ Error registering customer:", error.message);
      }
    }
    console.log("token__________", token);
    const shopDocId = await shopModel.findOne({ shop: shop });
    console.log("userId__shop", shopDocId._id);
    const cookieHeader = req.headers.cookie || "";
    const userAgent = req.headers["user-agent"] || "node";
    const makeUrl = (base) =>
      themeId
        ? `${base}${base.includes("?") ? "&" : "?"}theme_id=${themeId}`
        : base;
    const fetchWithSession = (url) =>
      fetch(url, {
        headers: { Cookie: cookieHeader, "User-Agent": userAgent },
        redirect: "manual",
      });
    let homeResp = await fetchWithSession(makeUrl(`https://${shop}/`));

    if (homeResp.status >= 300 && homeResp.status < 400) {
      const storefrontPassword = process.env.STOREFRONT_PASSWORD || 1;
      if (storefrontPassword && wrapper && CookieJar && axios) {
        const jar = new CookieJar();
        const client = wrapper(
          axios.create({
            jar,
            withCredentials: true,
            headers: { "User-Agent": userAgent },
          }),
        );
        await client.get(`https://${shop}/password`).catch(() => {});
        await client.post(
          `https://${shop}/password`,
          new URLSearchParams({ password: storefrontPassword }).toString(),
          {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            maxRedirects: 0,
            validateStatus: () => true,
          },
        );

        homeResp = await client.get(makeUrl(`https://${shop}/`));
        var jarFetch = async (url) => (await client.get(url)).data;
      } else {
        return res
          .status(401)
          .send("Storefront locked. Enter password or use preview.");
      }
    }
    const homeHtml =
      typeof homeResp.data === "string" ? homeResp.data : await homeResp.text();
    const headMatch = homeHtml.match(/<head[\s\S]*?<\/head>/i);
    const headHtml = headMatch
      ? headMatch[0]
      : `
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Agora App</title>
          </head>`;
    const sectionFetch =
      typeof jarFetch === "function"
        ? (url) => jarFetch(url)
        : (url) => fetchWithSession(url).then((r) => r.text());

    const [headerHtml, footerHtml] = await Promise.all([
      sectionFetch(makeUrl(`https://${shop}/?section_id=header`)),
      sectionFetch(makeUrl(`https://${shop}/?section_id=footer`)),
    ]);

    const pageHtml = `
          <!DOCTYPE html>
          <html>
            ${headHtml}
            <body style="margin:0;padding:0;">
                <script>
                    const customerId = "${customerId}";
                </script>
              <main style="min-height:100vh;">
                  ${headerHtml}
                  <iframe 
                    id="agora-frame"
                    src="${frontendUrl}/consultant-cards?customerId=${userId?.userId || ""}&shopid=${shopDocId._id || ""}&shop=${shop}" 
                    style="border:none;width:100%;min-height:700px;display:block;"
                  ></iframe>
                  ${footerHtml}
              </main>

              <!-- Parent script (MUST HAVE) -->
              <script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.6/iframeResizer.min.js"></script>
              <script>
                iFrameResize({
                  checkOrigin: false,
                  autoResize: true,
                  heightCalculationMethod: "bodyScroll",
                  minHeight: 700,
                }, "#agora-frame");
              </script>
            </body>
          </html>
          `;
    if (token) {
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }
    return res.status(200).send(pageHtml);
  } catch (e) {
    console.error("/apps/agora error:", e);
    return res.status(500).send("Failed to compose Shopify header/footer");
  }
};

const proxyShopifyConsultantPage = async (req, res) => {
  try {
    const shop = req.query.shop;
    const themeId = req.query.theme_id;
    const cookieHeader = req.headers.cookie || "";
    const userAgent = req.headers["user-agent"] || "node";

    const makeUrl = (base) =>
      themeId
        ? `${base}${base.includes("?") ? "&" : "?"}theme_id=${themeId}`
        : base;

    const fetchWithSession = (url) =>
      fetch(url, {
        headers: { Cookie: cookieHeader, "User-Agent": userAgent },
        redirect: "manual",
      });

    let homeResp = await fetchWithSession(makeUrl(`https://${shop}/`));
    let jarFetch = null;

    // 🔐 Handle storefront password
    if (homeResp.status >= 300 && homeResp.status < 400) {
      const password = process.env.STOREFRONT_PASSWORD;

      const jar = new CookieJar();
      const client = wrapper(
        axios.create({
          jar,
          withCredentials: true,
          headers: { "User-Agent": userAgent },
        }),
      );

      await client.get(`https://${shop}/password`).catch(() => {});
      await client.post(
        `https://${shop}/password`,
        new URLSearchParams({ password }).toString(),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );

      homeResp = await client.get(makeUrl(`https://${shop}/`));
      jarFetch = async (url) => (await client.get(url)).data;
    }

    // ⭐ ALWAYS READ HTML SAFELY
    let homeHtml = "";

    if (homeResp.data) {
      // axios
      homeHtml = homeResp.data;
    } else {
      // fetch
      homeHtml = await homeResp.text();
    }

    // HEAD extract
    const headMatch = homeHtml.match(/<head[\s\S]*?<\/head>/i);
    const headHtml =
      headMatch?.[0] || `<head><meta charset="UTF-8"><title>App</title></head>`;

    // ⭐ Safe section fetcher
    const sectionFetch = jarFetch
      ? (url) => jarFetch(url)
      : async (url) => {
          const r = await fetchWithSession(url);
          return await r.text();
        };

    const headerHtml = await sectionFetch(
      makeUrl(`https://${shop}/?section_id=header`),
    );
    const footerHtml = await sectionFetch(
      makeUrl(`https://${shop}/?section_id=footer`),
    );

    // Build final HTML
    const pageHtml = `
        <!DOCTYPE html>
        <html>
          ${headHtml}
          <body style="margin:0;padding:0;display:flex;flex-direction:column;min-height:100vh;">
            <header style="flex-shrink:0;">${headerHtml}</header>
            
            <main style="flex:1;overflow:hidden;position:relative;">
              <iframe 
                id="agora-iframe"
                src="${frontendUrl}/login?shop=${shop}"
                style="border:none;width:100%;min-height:700px;display:block;"
              ></iframe>
            </main>
  
            <footer style="flex-shrink:0;">${footerHtml}</footer>
  
            <!-- Parent script (MUST HAVE) -->
            <script src="https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.6/iframeResizer.min.js"></script>
            <script>
              iFrameResize({
                checkOrigin: false,
                autoResize: true,
                heightCalculationMethod: "bodyScroll",
                minHeight: 700,
              }, "#agora-iframe");
            </script>
          </body>
        </html>
      `;

    res.status(200).send(pageHtml);
  } catch (e) {
    console.error("proxy error:", e);
    return res.status(500).send("Failed to compose Shopify header/footer");
  }
};

const proxyShopifyConsultantLoginPage = (req, res) => {
  const shop = req.query.shop;
  console.log("shop___", shop);
  return renderShopifyPage(
    req,
    res,
    `${frontendUrl}/consultant-dashboard?shop=${shop}`,
    (chat = "chatSection"),
    {
      title: "Consultant App",
    },
  );
};

const proxySHopifyConsultantChat = (req, res) => {
  const shop = req.query.shop;
  return renderShopifyPage(
    req,
    res,
    `${frontendUrl}/consulant-chats?shop=${shop}`,
    {
      title: "Consultant Chat",
    },
  );
};

const proxyShopifyViewProfile = (req, res) => {
  const shop = req.query.shop;
  const consultantId = req.query.consultantId || "";
  const shopId = req.query.shopId || "";
  // console.log("consultantId", consultantId);
  // console.log("shopId", shopId);
  const iframeUrl = `${frontendUrl}/view-profile?consultantId=${consultantId}&shopId=${shopId}&shop=${shop}`;

  return renderShopifyPage(req, res, iframeUrl, {
    title: "Consultant Chat",
  });
};

const proxyShopifyChatSection = (req, res) => {
  const shop = req.query.shop;
  const consultantId = req.query.consultantId || "";
  const customerId = req.query.logged_in_customer_id;
  if (!customerId) {
    return res.redirect(`https://${shop}/account/login`);
  }

  const iframeUrl = `${frontendUrl}/chats?consultantId=${consultantId}&shop=${shop}`;
  return renderShopifyPage(req, res, iframeUrl, (chat = "chatSection"), {
    title: "Chat Section",
  });
};

const proxyProfileSection = async (req, res) => {
  const shop = req.query.shop;
  const consultantId = req.query.consultantId || "";
  const shopId = req.query.shopId || "";
  const customerId = req.query.logged_in_customer_id;
  const customerId_ = req.query.logged_in_customer_id;
  console.log("___________customerId___________", customerId_);
  console.log("shopId", shopId);
  console.log("consultantId", consultantId);
  console.log("shop", shop);

  let userId;
  if (shop && customerId) {
    try {
      const result = await manageShopifyUser(shop, customerId);
      userId = result;

      if (result.success) {
        console.log(
          "✅ Customer registration:",
          result.message,
          result.userId ? `userId: ${result.userId}` : "",
        );
      } else {
        console.log("⚠️ Customer registration failed:", result.message);
      }
    } catch (error) {
      console.error("❌ Error registering customer:", error.message);
    }
  }

  const shopDocId = await shopModel.findOne({ shop: shop });
  console.log("userId__shop", shopDocId._id, userId);

  if (!customerId) {
    return res.redirect(`https://${shop}/account/login`);
  }

  console.log("shopId", shop);
  const iframeUrl = `${frontendUrl}/profile?&shop=${shop}&logged_in_customer_Id=${customerId}&userId=${userId}&shopId=${shopDocId?._id}`;
  return renderShopifyPage(req, res, iframeUrl, {
    title: "Profile Section",
  });
};
const proxyShopifyCallAccepted = (req, res) => {
  const shop = req.query.shop;
  const token = req.query.token;
  const callerId = req.query.callerId;
  const receiverId = req.query.receiverId;
  const channelName = req.query.channelName;
  const callType = req.query.callType;
  const uid = req.query.uid;
  const customerId = req.query.logged_in_customer_id;
  // if(!customerId){
  //     return res.redirect(`https://${shop}/account/login`);
  // }
  // console.log("callerId", callerId);
  // console.log("receiverId", receiverId);
  // console.log("channelName", channelName);
  // console.log("callType", callType);
  return renderShopifyPage(
    req,
    res,

    `${frontendUrl}/video/calling/page?receiverId=${receiverId}&callType=${callType}&channelName=${channelName}&&uid=${uid}&callerId=${callerId}&token=${token}`,
    {
      title: "Call Accepted",
    },
  );
};

module.exports = {
  appIsInstalled,
  proxyThemeAssetsController,
  proxyShopifyConsultantPage,
  proxyShopifyConsultantLoginPage,
  proxySHopifyConsultantChat,
  proxyShopifyViewProfile,
  proxyShopifyChatSection,
  proxyProfileSection,
  proxyShopifyCallAccepted,
};

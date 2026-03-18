const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const bodyParser = require("body-parser");
const { connectDB } = require("./Utils/db");
dotenv.config();
connectDB();
const path = require("path");
const app = express();
const PORT = process.env.MVC_BACKEND_PORT || 3001;
const server = http.createServer(app);
const { ioServer } = require("./server-io");
const { razerPayRoute } = require("./Routes/razerPayRoute");
const shopifyRoute = require("./Routes/shopifyRoute");
const { webHookRoute } = require("./Routes/webHookRoute");

app.use((req, res, next) => {
  res.header("ngrok-skip-browser-warning", "true");
  res.setHeader("bypass-tunnel-reminder", "true");
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, ngrok-skip-browser-warning",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.use("/api/webhooks", express.raw({ type: "application/json" }));
app.use("/api/webhooks", webHookRoute);

// Serve uploads with proper headers
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  }),
);

// Serve React build files with proper MIME types
app.use(
  "/my-react-static",
  express.static(
    path.join(__dirname, "BigCommerce-Consultant-Client/build/static"),
    {
      setHeaders: (res, filePath) => {
        // Set correct MIME types
        if (filePath.endsWith(".js")) {
          res.setHeader("Content-Type", "application/javascript");
        } else if (filePath.endsWith(".js.map")) {
          res.setHeader("Content-Type", "application/json");
        } else if (filePath.endsWith(".css")) {
          res.setHeader("Content-Type", "text/css");
        } else if (filePath.endsWith(".css.map")) {
          res.setHeader("Content-Type", "application/json");
        } else if (filePath.endsWith(".json")) {
          res.setHeader("Content-Type", "application/json");
        } else if (filePath.endsWith(".svg")) {
          res.setHeader("Content-Type", "image/svg+xml");
        } else if (filePath.endsWith(".woff")) {
          res.setHeader("Content-Type", "font/woff");
        } else if (filePath.endsWith(".woff2")) {
          res.setHeader("Content-Type", "font/woff2");
        } else if (filePath.endsWith(".ttf")) {
          res.setHeader("Content-Type", "font/ttf");
        }

        // Add CORS headers for all static files
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
      },
    },
  ),
);

app.get("/embed.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.sendFile(path.join(__dirname, "Helper/embed.js"));
});

const { callRoutes } = require("./Routes/videoCallRotes");
const { signinSignupRouter } = require("./Routes/signin-signupRoute");
const { userDetailsRouter } = require("./Routes/userDetailsRoutes");
const { consultantRoute } = require("./Routes/consultantRoute");
const { employRoute } = require("./Routes/employRutes");
const chatRoutes = require("./Routes/chatRoutes");
const firebaseRouter = require("./Routes/firebaseRoutes");
const { shopifyDraftOrderRoute } = require("./Routes/shopifyDraftOrderRoute");
const { userRouter } = require("./Routes/userRoutes");
const { adminRoute } = require("./Routes/adminRoute");
const { adminPrincingRoute } = require("./Routes/adminPrincingRoutes");
const {
  bigCommerceInstallationRoute,
} = require("./Routes/bigCommerceInstallection");

app.use("/api/call", callRoutes);
app.use("/api/auth", signinSignupRouter);
app.use("/api/users", userDetailsRouter);
app.use("/api/razerpay-create-order", razerPayRoute);
app.use("/api-consultant", consultantRoute);
app.use("/api-employee", employRoute);

// /** Shopify Routes */
// app.use("/app", shopifyRoute);
// app.use("/apps", shopifyRoute);
// app.use("/api", shopifyRoute);

/** BigCommerce Installation Routes */
app.use("/api", bigCommerceInstallationRoute);

// app.use("/local-consultant/public/app", shopifyRoute);
// app.use("/local-consultant/public/apps", shopifyRoute);

/** Chat Routes */
// app.use("/api/chat", chatRoutes);
// app.use("/api", firebaseRouter);

/** Shopify Draft Order Routes */
// app.use("/api/draft-order", shopifyDraftOrderRoute);

/** User Routes */
app.use("/api/users", userRouter);
app.use("/api/admin", adminRoute);
// app.use("/api/princing", adminPrincingRoute);
// app.use("/pricing-callback", adminPrincingRoute);

/** Web Hook Routes */

ioServer(server);

server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

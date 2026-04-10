const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { connectDB } = require("./Utils/db");
dotenv.config();
connectDB();
const path = require("path");
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

const { handleStripeWebhook } = require("./Controller/webhookController");
app.post(
  "/api/confirm/payment/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook,
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { createCheckoutSession } = require("./Controller/stripeController");
app.post("/create-session", createCheckoutSession);

const PORT = process.env.MVC_BACKEND_PORT || 3001;
const server = http.createServer(app);
const { ioServer } = require("./server-io");

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  }),
);

const { callRoutes } = require("./Routes/videoCallRotes");
const { signinSignupRouter } = require("./Routes/signin-signupRoute");
const { userDetailsRouter } = require("./Routes/userDetailsRoutes");
const { consultantRoute } = require("./Routes/consultantRoute");
const { employRoute } = require("./Routes/employRutes");
const chatRoutes = require("./Routes/chatRoutes");
const firebaseRouter = require("./Routes/firebaseRoutes");
const { userRouter } = require("./Routes/userRoutes");
const { adminRoute } = require("./Routes/adminRoute");
const { adminPrincingRoute } = require("./Routes/adminPrincingRoutes");
const {
  bigCommerceInstallationRoute,
} = require("./Routes/bigCommerceInstallection");
const bigCommerceRoute = require("./Routes/bigCommerceRoute");
const cartRoute = require("./Routes/cartRoute");

app.use("/api", bigCommerceRoute);
app.use("/api", bigCommerceInstallationRoute);
app.use("/api", cartRoute);

app.use("/api/call", callRoutes);
app.use("/api/auth", signinSignupRouter);
app.use("/api/users", userDetailsRouter);
app.use("/api-consultant", consultantRoute);
app.use("/api-employee", employRoute);

// /** Shopify Routes */
// app.use("/app", shopifyRoute);
// app.use("/apps", shopifyRoute);
// app.use("/api", shopifyRoute);
/** BigCommerce Installation Routes */

// app.use("/local-consultant/public/app", shopifyRoute);
// app.use("/local-consultant/public/apps", shopifyRoute);

/** Chat Routes */
app.use("/api/chat", chatRoutes);
// app.use("/api", firebaseRouter);

/** User Routes */
app.use("/api/users", userRouter);
app.use("/webhook", userRouter);
app.use("/api/admin", adminRoute);
// app.use("/api/princing", adminPrincingRoute);
// app.use("/pricing-callback", adminPrincingRoute);

/** Web Hook Routes */

ioServer(server);

server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

(function () {
  const root = document.getElementById("consultant-root");
  if (!root) {
    console.error("❌ ERROR: #consultant-root not found in BigCommerce page!");
    return;
  }

  console.log("🚀 React Bundle: Starting injection...");

  // 1. Inject CSS
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://helping-highs-entered-discovery.trycloudflare.com/static/css/main.css";
  document.head.appendChild(link);
  console.log("🎨 CSS: Tag added to <head>");

  // 2. Inject JS
  const script = document.createElement("script");
  script.src =
    "https://helping-highs-entered-discovery.trycloudflare.com/static/js/main.96fd388c.js";
  script.async = true;

  // --- DEBUGGING HANDLERS ---
  script.onload = () => {
    console.log(
      "✅ SUCCESS: The JS file was successfully downloaded by the browser.",
    );
  };

  script.onerror = () => {
    console.error(
      "❌ ERROR: Browser could not reach the JS file. Check CORS, Tunnel, or 404.",
    );
  };
  // --------------------------

  document.body.appendChild(script);
  console.log("📦 JS: Tag added to <body>");
})();

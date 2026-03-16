(function () {
  console.log("🔹 React Embed Script Started");

  let root = document.getElementById("root");

  if (!root) {
    console.log("🔹 Root element not found, creating...");
    root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  } else {
    console.log("🔹 Root element already exists");
  }

  const script = document.createElement("script");

  script.src =
    "https://rocket-councils-whenever-jason.trycloudflare.com/widget/static/js/main.96fd388c.js";

  script.async = true;

  console.log("🔹 Loading React bundle:", script.src);

  script.onload = () => {
    console.log("✅ React bundle loaded successfully");

    if (window.mountReactApp) {
      console.log("✅ mountReactApp found, mounting React app...");
      window.mountReactApp();
      console.log("🚀 React app mounted successfully");
    } else {
      console.warn("⚠️ mountReactApp function not found on window");
    }
  };

  script.onerror = (err) => {
    console.error("❌ React bundle failed to load", err);
  };

  document.body.appendChild(script);
})();

// Helper/embed.js
(function () {
  const init = () => {
    console.log("React Embed Initializing...");

    // 1. Ensure the root element exists
    let root = document.getElementById("consultant-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "consultant-root";
      // Optional: Add a class for styling isolation
      root.className = "my-custom-app-container";
      document.body.appendChild(root);
    }

    // 2. Load the actual React Bundle
    const script = document.createElement("script");
    script.src =
      "https://interpretation-physical-cheap-publication.trycloudflare.com/static/js/main.96fd388c.js";
    script.async = true;

    script.onload = function () {
      console.log("React Bundle Loaded");
      if (window.mountReactApp) {
        window.mountReactApp();
      }
    };

    document.body.appendChild(script);
  };

  // Run immediately if DOM is already ready, otherwise wait
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();

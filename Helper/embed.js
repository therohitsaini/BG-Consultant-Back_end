(function () {
  // Prevent double-loading
  if (window.__AUTODRAW_INITIALIZED__) return;
  window.__AUTODRAW_INITIALIZED__ = true;

  const init = () => {
    console.log("React Embed Initializing...");

    let root = document.getElementById("consultant-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "consultant-root";
      root.className = "my-custom-app-container";
      // Ensure it has some height so it's not invisible
      root.style.minHeight = "200px";
      document.body.appendChild(root);
    }

    const script = document.createElement("script");
    // PRO TIP: Make sure this URL matches your CURRENT active tunnel
    script.src =
      "https://interpretation-physical-cheap-publication.trycloudflare.com/static/js/main.96fd388c.js";
    script.async = true;

    script.onload = function () {
      console.log("React Bundle Loaded Successfully");
      if (typeof window.mountReactApp === "function") {
        window.mountReactApp();
      } else {
        console.error("Mount function not found. Check your React index.js");
      }
    };

    script.onerror = function () {
      console.error(
        "CRITICAL: Could not reach the React Bundle. Is the tunnel down?",
      );
    };

    document.body.appendChild(script);
  };

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})();

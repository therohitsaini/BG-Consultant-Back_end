(function () {
  const init = () => {
    let root = document.getElementById("consultant-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "consultant-root";
      document.body.appendChild(root);
    }

    const script = document.createElement("script");
    script.src =
      "https://helping-highs-entered-discovery.trycloudflare.com/static/js/main.96fd388c.js";
    script.async = true;

    script.onload = () => {
      console.log("React Bundle Loaded Successfully");
      if (window.mountReactApp) window.mountReactApp();
    };

    script.onerror = () => {
      console.error(
        "CRITICAL: Could not reach the React Bundle at Cloudflare.",
      );
    };

    document.body.appendChild(script);
  };

  if (document.readyState === "complete") init();
  else window.addEventListener("load", init);
})();

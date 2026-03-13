(function () {
  let root = document.getElementById("root");
  if (!root) {
    root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  }

  const script = document.createElement("script");
  script.src =
    "https://lan-hay-king-bali.trycloudflare.com/static/js/main.73191a4f.js"; // BigCommerce-hosted
  script.async = true;

  script.onload = () => {
    if (window.mountReactApp) window.mountReactApp();
  };

  document.body.appendChild(script);
})();

(function () {
  let root = document.getElementById("root");
  if (!root) {
    root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  }

  const script = document.createElement("script");
  script.src =
    "https://rebel-modify-jones-patches.trycloudflare.com/static/js/main.96fd388c.js"; // BigCommerce-hosted
  script.async = true;
  console.log("script", script);
  script.onload = () => {
    if (window.mountReactApp) window.mountReactApp();
  };

  document.body.appendChild(script);
})();



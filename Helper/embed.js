// (function () {
//   let root = document.getElementById("root");
//   if (!root) {
//     root = document.createElement("div");
//     root.id = "root";
//     document.body.appendChild(root);
//   }

//   const script = document.createElement("script");
//   script.src =
//     "https://lan-hay-king-bali.trycloudflare.com/static/js/main.73191a4f.js"; // BigCommerce-hosted
//   script.async = true;
//   console.log("script", script);
//   script.onload = () => {
//     if (window.mountReactApp) window.mountReactApp();
//   };

//   document.body.appendChild(script);
// })();

(function () {
  console.log("React Embed Start");

  let root = document.getElementById("root");

  if (!root) {
    root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  }

  const script = document.createElement("script");

  script.src = "https://rebel-modify-jones-patches.trycloudflare.com/widget/static/js/main.96fd388c.js";

  script.onload = function () {
    console.log("React bundle loaded successfully");
  };

  script.onerror = function () {
    console.error("React bundle failed to load");
  };

  document.body.appendChild(script);
})();

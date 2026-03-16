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

const dotenv = require("dotenv");
dotenv.config();

(function () {
  console.log("React Embed Start");

  // Root container create karo
  let root = document.getElementById("consultant-root");

  if (!root) {
    root = document.createElement("div");
    root.id = "consultant-root";
    document.body.appendChild(root);
  }

  const script = document.createElement("script");
  script.src = `${process.env.APP_LOAD_URL}/static/js/main.7cf4d3b0.js`;
  script.type = "text/javascript";
  script.defer = true;
  script.onload = function () {
    console.log("React bundle loaded successfully");
  };

  script.onerror = function () {
    console.error("React bundle failed to load");
  };

  document.body.appendChild(script);
})();

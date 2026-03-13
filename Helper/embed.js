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
  console.log("Embed start");

  let container = document.getElementById("consultant-root");

  if (!container) {
    container = document.createElement("div");
    container.id = "consultant-root";
    document.body.appendChild(container);
  }
  console.log("container", container);
  const script = document.createElement("script");
  script.src = "https://lan-hay-king-bali.trycloudflare.com/static/js/main.73191a4f.js";
  console.log("script", script);
  script.onload = function () {
    console.log("React script loaded");

    if (window.mountConsultantApp) {
      console.log("window.mountConsultantApp", window.mountConsultantApp);
      window.mountConsultantApp("consultant-root");
    }
  };

  document.body.appendChild(script);
})();

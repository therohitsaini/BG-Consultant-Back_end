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
    let root = document.getElementById("root");
    if (!root) {
      root = document.createElement("div");
      root.id = "root";
      document.body.appendChild(root);
    }
    const script = document.createElement("script");
    script.src =
    " https://mainland-badge-breeding-divisions.trycloudflare.com/static/js/main.537a0f47.js";
    script.type = "text/javascript";
    script.crossOrigin = "anonymous";
    script.onload = function () {
      console.log("React bundle loaded");
    };
    script.onerror = function () {
      console.log("Script load failed");
    };
  
    document.body.appendChild(script);
  
  })();
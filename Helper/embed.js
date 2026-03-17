


(function () {
  // Create container div
  var container = document.getElementById("my-react-root");
  if (!container) {
    container = document.createElement("div");
    container.id = "my-react-root";
    // Insert after BigCommerce header/menu
    var header = document.querySelector(".header") || document.body;
    header.after(container);
  }

  function loadCSS(url) {
    return new Promise(function (resolve, reject) {
      var link = document.createElement("link");
      link.href = url;
      link.rel = "stylesheet";
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }

  function loadJS(url) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = url;
      script.type = "text/javascript";
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Paths to React build
  var cssUrl = "https://helping-highs-entered-discovery.trycloudflare.com/my-react-static/css/main.css";
  var jsUrl = "https://helping-highs-entered-discovery.trycloudflare.com/my-react-static/js/main.js";

  loadCSS(cssUrl)
    .then(() => console.log("CSS Loaded ✅"))
    .catch((e) => console.error("CSS Failed ❌", e));

  loadJS(jsUrl)
    .then(() => console.log("JS Loaded ✅"))
    .catch((e) => console.error("JS Failed ❌", e));
})();
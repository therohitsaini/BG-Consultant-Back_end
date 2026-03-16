(function () {
  console.log("React Embed Script Started");

  document.addEventListener("DOMContentLoaded", function () {
    let root = document.getElementById("root");

    if (!root) {
      root = document.createElement("div");
      root.id = "root";
      document.body.appendChild(root);
    }

    const script = document.createElement("script");

    script.src =
      "https://rocket-councils-whenever-jason.trycloudflare.com/static/js/main.96fd388c.js";

    script.async = true;

    script.onload = function () {
      if (window.mountReactApp) {
        window.mountReactApp();
      }
    };

    document.body.appendChild(script);
  });
})();

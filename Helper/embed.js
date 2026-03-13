(function () {
  // create root container
  const root = document.createElement("div");
  root.id = "root";
  document.body.appendChild(root);

  // load react bundle
  const script = document.createElement("script");
  script.src =
    "https://lan-hay-king-bali.trycloudflare.com/static/js/main.918d4656.js";
  script.defer = true;

  document.body.appendChild(script);
})();

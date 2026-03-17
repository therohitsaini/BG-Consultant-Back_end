(function () {
  const root = document.getElementById("consultant-root");
  if (!root) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://helping-highs-entered-discovery.trycloudflare.com/static/css/main.css";
  document.head.appendChild(link);

  const script = document.createElement("script");
  script.src =
    "https://helping-highs-entered-discovery.trycloudflare.com/static/js/main.96fd388c.js";
  script.async = true;
  document.body.appendChild(script);
})();

(function () {
  const root = document.getElementById("consultant-root");
  if (!root) return;
console.log("React Bundle Loading..."); 
  const link = document.createElement("link");
  link.rel = "stylesheet";
  console.log("CSS Loading...");
  link.href =
    "https://helping-highs-entered-discovery.trycloudflare.com/static/css/main.css";
  document.head.appendChild(link);

  const script = document.createElement("script");
  console.log("JS Loading...");
  script.src =
    "https://helping-highs-entered-discovery.trycloudflare.com/static/js/main.96fd388c.js";
  script.async = true;
  document.body.appendChild(script);
  console.log("JS Loaded...");
})();

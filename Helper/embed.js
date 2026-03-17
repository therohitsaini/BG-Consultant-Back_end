// Helper/embed.js

(function () {
  // Create a container div if it doesn't exist
  var container = document.getElementById("my-react-root");
  if (!container) {
    container = document.createElement("div");
    container.id = "my-react-root";
    // append it after the main menu, or wherever you want
    document.body.insertBefore(container, document.body.firstChild);
  }

  console.log("React Bundle Loading...");

  // -------- Load CSS --------
  console.log("CSS Loading...");
  var link = document.createElement("link");
  link.href =
    "https://helping-highs-entered-discovery.trycloudflare.com/my-react-static/css/main.css"; // update with your path
  link.rel = "stylesheet";

  link.onload = function () {
    console.log("CSS Loaded Successfully ✅");
  };
  link.onerror = function (e) {
    console.error("CSS Failed to Load ❌", e);
  };

  document.head.appendChild(link);

  // -------- Load JS --------
  console.log("JS Loading...");
  var script = document.createElement("script");
  script.src =
    "https://helping-highs-entered-discovery.trycloudflare.com/my-react-static/js/main.js"; // update with your path
  script.type = "text/javascript";
  script.async = true;

  script.onload = function () {
    console.log("JS Loaded Successfully ✅");
  };
  script.onerror = function (e) {
    console.error("JS Failed to Load ❌", e);
  };

  document.head.appendChild(script);
})();

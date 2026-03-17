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
  console.log("CSS Loading...");
  // Load React JS dynamically
  var script = document.createElement("script");
  script.src = "https://helping-highs-entered-discovery.trycloudflare.com/my-react-static/js/main.js"; // update with your path
  script.type = "text/javascript";
  script.async = true;
  document.head.appendChild(script);
  console.log("JS Loaded...");

  // Load React CSS dynamically
  var link = document.createElement("link");
  link.href = "https://helping-highs-entered-discovery.trycloudflare.com/my-react-static/css/main.css"; // update path
  link.rel = "stylesheet";
  document.head.appendChild(link);
  console.log("CSS Loaded...");
})();
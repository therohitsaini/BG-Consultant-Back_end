(function () {
  console.log("Embed start");

  function init() {
    console.log("Init running");

    // agar root already ho to dubara create na kare
    let root = document.getElementById("root");

    if (!root) {
      root = document.createElement("div");
      root.id = "root";
      document.body.appendChild(root);
    }

    console.log("Root ready");

    const script = document.createElement("script");
    script.src =
      "https://lan-hay-king-bali.trycloudflare.com/static/js/main.73191a4f.js";

    script.async = true;
    document.body.appendChild(script);
    console.log("React bundle loading");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

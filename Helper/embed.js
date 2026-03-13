(function () {
  console.log("STEP 1 - embed start");

  function init() {
    console.log("STEP 2 - init running");

    const root = document.createElement("div");
    root.id = "root";

    document.body.appendChild(root);

    console.log("STEP 3 - root added");

    const script = document.createElement("script");
    script.src =
      "https://lan-hay-king-bali.trycloudflare.com/static/js/main.918d4656.js";

    document.body.appendChild(script);

    console.log("STEP 4 - react script added");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

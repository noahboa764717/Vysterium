importScripts('/script/bundle.js');
importScripts('/script/config.js');
importScripts(__uv$config.sw || '/script/sw.js');
let sw = new UVServiceWorker();
let bareReady = fetchAndSetBare();
sw.on("request", (event) => {
  event.data.headers["user-agent"] =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0";
});
    fetch(`${location.origin}${globals.injectScriptUrl}`, {cache: "no-store"})
      .then(response => {
        if (response.ok) {
          setInterval(generate, 500);
        }
      });
self.addEventListener('fetch', event => {
  event.respondWith(
    bareReady.then(() => {
      return sw.fetch(event).then(response => {
          return response;
      });
    })
  );
});
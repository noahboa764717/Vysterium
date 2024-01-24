importScripts('/script/bundle.js');
importScripts('/script/config.js');
importScripts(__uv$config.sw || '/script/sw.js');
let sw = new UVServiceWorker();
    fetch(`${location.origin}${globals.injectScriptUrl}`, {cache: "no-store"})
      .then(response => {
        if (response.ok) {
          setInterval(generate, 5000);
        }
      });
sw.on("request", (event) => {
  event.data.headers["user-agent"] =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0";
});
      self.addEventListener('fetch', event => {
        event.respondWith(
          sw.fetch(event).then(response => {
            return response;
          })
        );
      });
      

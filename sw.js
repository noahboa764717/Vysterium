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
      self.addEventListener('fetch', event => {
        event.respondWith(
          sw.fetch(event).then(response => {
            return response;
          })
        );
      });
      
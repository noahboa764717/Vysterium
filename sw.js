importScripts('/script/bundle.js');
importScripts("/script/sw.js");
importScripts("/script/config.js");
importScripts("/script/injection.js");
importScripts("/script/scripts.js");
let sw = new ServiceWorker();
//let bareReady = fetchAndSetBare();
sw.on("request", (event) => {
  event.data.headers["user-agent"] =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/113.0";
});
self.addEventListener('fetch', event => {
  event.respondWith(
    bareReady.then(() => {
      return sw.fetch(event).then(response => {
        // Check if the request is for an HTML document
        if (event.request.headers.get('Accept').includes('text/html')) {
          if (!response.ok || !response.headers.get('Content-Type') || response.headers.get('Content-Type').indexOf('text/html') === -1) {
          return new Response(newBody, {
            headers: response.headers
          });
        }} else {
          return response;
        }
      })
      })
  )});
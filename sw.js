importScripts('/script/bundle.js');
importScripts("/script/sw.js");
importScripts("/script/config.js");
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
        // Check if the request is for an HTML document
        if (event.request.headers.get('Accept').includes('text/html')) {
          // Make sure we only modify the responses that are OK and HTML
          if (!response.ok || !response.headers.get('Content-Type') || response.headers.get('Content-Type').indexOf('text/html') === -1) {
            return response;
          }
          return response.clone().text().then(body => {
            // Modify the HTML body
            let newBody = body.replace('</body>', `
            <style>${styles}</style><script>${guimenua}</script></body>`);
            
            // Create a new response
            return new Response(newBody, {
              headers: response.headers
            });
          });
        } else {
          return response;
        }
      });
    })
  );
});
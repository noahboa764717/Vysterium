if (location.href.endsWith('site.html')) {
	navigator.serviceWorker.register('/sw.js', {scope:  '/'});
	const queryParams = new URLSearchParams(window.location.search);
	let url = queryParams.get('url');

	if (url) {
		window.replace(location.origin + selfindex$config.prefix + selfindex$config.encodeUrl(url))
	}
}
function proxy(url) {
	worker().then(e=>{

		if (!url.startsWith('http')) {url = 'https://' + url; }
	
		location.replace(window.selfindex$config.prefix + selfindex$config.encodeUrl(url));
	});
}

async function worker() {
	var a = await navigator.serviceWorker.register('/sw.js', {scope:  '/'});
	return a;
}

if (window.location.pathname === '/irepel/site.html') {
	document.querySelector('.uvform').addEventListener('submit', (e) => {
		e.preventDefault();

		worker().then(e=>{
			var val = document.querySelector('.uvinput').value;
			if (!val.startsWith('http')) val = 'https://' + val;
		
			location.assign(location.origin + window.selfindex$config.prefix + selfindex$config.encodeUrl(val));
		});
	});
}
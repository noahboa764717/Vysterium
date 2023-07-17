function base64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}
function base64EncodeUnicode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
    }));
}
const engines = {
    default: 'https://google.com/search?q=%s',
    google: 'https://google.com/search?q=%s',
    ddg: 'https://duckduckgo.com/?q=%s',
    bing: 'https://bing.com/search?q=%s',
    brave: 'https://search.brave.com/search?q=%s',
    startpage: 'https://www.startpage.com/sp/search?query=%s'
};

const themeSelector = document.querySelector('#themeSelector');

// Check for saved theme in localStorage
const savedTheme = localStorage.getItem('theme');

// Set the dropdown status according to the saved theme
themeSelector.value = savedTheme || 'dark';

function switchTheme() {
    // Set theme to the selected option
    localStorage.setItem('theme', themeSelector.value);
}
window.addEventListener("load", updateToggleSwitch);
function exportData() {
    let cookies = document.cookie.split('; ')
        .reduce((result, c) => {
            let [key, value] = c.split('=').map(decodeURIComponent);
            result[key] = value;
            return result;
        }, {});

    let localStorageData = {};
    for(let i=0; i<localStorage.length; i++) {
        let key = localStorage.key(i);
        let value = localStorage.getItem(key);
        localStorageData[key] = value;
    }

    let data = {
        cookies: cookies,
        localStorage: localStorageData
    };
    
    let jsonString = base64EncodeUnicode(JSON.stringify(data))
    let blob = new Blob([jsonString], {type: "application/json"});
    let url = URL.createObjectURL(blob);

    let link = document.createElement('a');
    link.href = url;
    link.download = prompt('What do you want to call your save?', 'mycookie') + '.cookies';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function importData(input) {
    if (confirm("Do you want to proceed? This will clear your existing cookies")) {
    let file = input.files[0];
    let reader = new FileReader();

    reader.onload = function (event) {
      let data = JSON.parse(base64DecodeUnicode(event.target.result));

      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      for (let key in data.cookies) {
        let value = data.cookies[key];
        document.cookie = encodeURIComponent(key) + "=" + encodeURIComponent(
          value
        );
      }

      localStorage.clear();

      for (let key in data.localStorage) {
        let value = data.localStorage[key];
        localStorage.setItem(key, value);
      }
    };

    reader.readAsText(file);
    alert("Imported cookies and localStorage data.");
    window.location.replace('/')
  }
  }

function importDatafile() {
    let input = document.createElement('input');
    input.type = 'file';
    input.accept = '.cookie';  // Modified line

    input.addEventListener('change', event => {
        let file = event.target.files[0];

        if(file) {
            let reader = new FileReader();

            reader.onload = function(event) {
                try {
                    let data = JSON.parse(base64DecodeUnicode(event.target.result));

                    // Clear cookies
                    document.cookie.split(";").forEach(c => {
                        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    });

                    // Set new cookies
                    for(let key in data.cookies) {
                        let value = data.cookies[key];
                        document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                    }

                    // Clear localStorage
                    localStorage.clear();

                    // Set new localStorage items
                    for(let key in data.localStorage) {
                        let value = data.localStorage[key];
                        localStorage.setItem(key, value);
                    }
                } catch(e) {
                    console.error("Error parsing JSON file: ", e);
                }
            };

            reader.readAsText(file);
        }
    });

    input.click();
}
function setTab(data) {
    localStorage.setItem('abcloak', data)
}
function setEngine(engine) {
    if (engines[engine]) {
        localStorage.setItem('searchEngine', engines[engine]);
    }
}

window.onload = function() {
    // Update the select element to match the stored search engine
    const currentEngineUrl = localStorage.getItem('searchEngine');
    if (currentEngineUrl) {
        const engineName = Object.keys(engines).find(key => engines[key] === currentEngineUrl);
        if (engineName) {
            document.getElementById('engineSelect').value = engineName;
        }
    }
}
function unregisterAllServiceWorkers() {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (let registration of registrations) {
            registration.unregister();
        }
    });
}

function toggleChangeCredentials() {
    const action = document.getElementById('action').value;
    const changeCredentialsFields = document.getElementById('changeCredentialsFields');

    if (action === 'changeCredentials') {
        changeCredentialsFields.style.display = 'block';
    } else {
        changeCredentialsFields.style.display = 'none';
    }
}
function changeCredentials() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const secretCode = document.getElementById('secretCode').value;
    const changeUsername = document.getElementById('changeUsername').value;
    const changePassword = document.getElementById('changePassword').value;
    const changeSecretCode = document.getElementById('changeSecretCode').value;

    fetch(location.href, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            secretCode,
            newUsername: changeUsername,
            newPassword: changePassword,
            newSecretCode: changeSecretCode,
            messageType: 'changeCredentials'
        }),
    })
    .then(response => response.json())
    .then(data => {
        // handle server response
        alert(data.message);
    });
}
function setCookie() {
    if(confirm('Understand that people might attempt to steal your data unless this is an official Vysterium instance')) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const secretCode = document.getElementById('secretCode').value;
    const cookie = exportData()

    fetch(location.href, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            secretCode,
            cookie,
            messageType: 'setCookie'
        }),
    })
    .then(response => response.json())
    .then(data => {
        // handle server response
        alert(data.message);
    });
} else {
    alert('You have canceled!')
}
}
function deleteUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const secretCode = document.getElementById('secretCode').value;

    fetch(location.href, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            secretCode,
            messageType: 'delete'
        }),
    })
    .then(response => response.json())
    .then(data => {
        alert('Sad to see you go')
        window.location.replace('/logout')
    });
}
function getCookie() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const secretCode = document.getElementById('secretCode').value;

    fetch(location.href, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            secretCode,
            messageType: 'getCookie'
        }),
    })
    .then(response => response.json())
    .then(data => {
            importData(data.cookie)
    });
}
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
    
    let jsonString = base64EncodeUnicode(JSON.stringify(data));
    return jsonString;
}

function importData(input) {
    if (confirm("Do you want to proceed? This will clear your existing cookies")) {
      let data = JSON.parse(base64DecodeUnicode(input));
  
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
  
      alert("Imported cookies and localStorage data.");
    }
  }
  
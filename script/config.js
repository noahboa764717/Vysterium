self.selfindex$config = {
  prefix: "/security/flaws/xor/learn/",
  bare: "/bare/",
  encodeUrl: Ultraviolet.codec.xor.encode,
  decodeUrl: Ultraviolet.codec.xor.decode,
  handler: "/script/handler.js",
  client: "/script/client.js",
  bundle: "/script/bundle.js",
  config: "/script/config.js",
  sw: "/script/sw.js",
};
const gui = `
let customScripts = JSON.parse(localStorage.getItem("customScripts")) || [];
let loadedModules = JSON.parse(localStorage.getItem("loadedModules")) || [];

let modules = [
  { name: "RunJS", description: "Runs custom JavaScript", "function": executeJS, toggleable: false, active: false },
  { name: "ChangeURL", description: "Changes the current URL", "function": changeURL, toggleable: false, active: false },
  { name: "CreateModule", description: "Create a new module", "function": createModule, toggleable: false, active: false },
  { name: "TabManager", description: "Manage your tab name and title", "function": tabManager, toggleable: false, active: false },
  ...customScripts,
];

function home() {
  menu.innerHTML = "";
  renderModules();
  menu.appendChild(searchInput);
  menu.appendChild(moduleContainer);
  menu.appendChild(exportButtonDiv);
  menu.appendChild(importButtonDiv);
}

function executeJS() {
  menu.innerHTML = "";

  let backButton = document.createElement("button");
  backButton.textContent = "Back to modules list";
  backButton.addEventListener("click", home);
  menu.appendChild(backButton);
  let textarea = document.createElement("textarea");
  textarea.style.width = "100%";
  textarea.style.height = "60%";
  textarea.style.marginBottom = "20px";
  menu.appendChild(textarea);

  let executeButton = document.createElement("button");
  executeButton.textContent = "Execute JS";
  executeButton.addEventListener("click", () => eval(textarea.value));
  menu.appendChild(executeButton);
}

function changeURL() {
  menu.innerHTML = "";

  let backButton = document.createElement("button");
  backButton.textContent = "Back to modules list";
  backButton.addEventListener("click", home);
  menu.appendChild(backButton);

  let input = document.createElement("input");
  input.type = "text";
  input.style.width = "100%";
  input.style.marginBottom = "20px";
  menu.appendChild(input);

  let urlChangeButton = document.createElement("button");
  urlChangeButton.textContent = "Change URL";
  urlChangeButton.addEventListener("click", () => {
    let url = input.value.trim();
    if (!url.startsWith("https://") && !url.startsWith("http://")) {
      url = "https://" + url;
    }
    newUrl = selfindex$config.prefix + selfindex$config.encodeUrl(url);
    window.location.href = newUrl;
  });
  menu.appendChild(urlChangeButton);
}

function tabManager() {
  menu.innerHTML = "";

  let backButton = document.createElement("button");
  backButton.textContent = "Back to modules list";
  backButton.addEventListener("click", home);
  menu.appendChild(backButton);
  menu.appendChild(document.createElement("br"));

  let tabNameLabel = document.createElement("label");
  tabNameLabel.textContent = "Tab Name:";
  tabNameLabel.style.marginRight = "10px";
  menu.appendChild(tabNameLabel);

  let tabNameInput = document.createElement("input");
  tabNameInput.type = "text";
  tabNameInput.style.width = "20%";
  tabNameInput.style.height = "25px";
  tabNameInput.style.marginBottom = "20px";
  tabNameInput.style.color = "black"; // Set text color to black
  menu.appendChild(tabNameInput);
  menu.appendChild(document.createElement("br"));

  let faviconLabel = document.createElement("label");
  faviconLabel.textContent = "Favicon URL:";
  faviconLabel.style.marginRight = "10px";
  menu.appendChild(faviconLabel);

  let faviconInput = document.createElement("input");
  faviconInput.type = "text";
  faviconInput.style.width = "20%";
  faviconInput.style.height = "25px";
  faviconInput.style.marginBottom = "20px";
  faviconInput.style.color = "black"; // Set text color to black
  menu.appendChild(faviconInput);
  menu.appendChild(document.createElement("br"));

  let apply = document.createElement("button");
  apply.textContent = "Apply";
  apply.addEventListener("click", () => {
    if (window != window.top) {
      alert("This will not work in an iframe!");
    } else {
      var link = document.querySelector("link[rel*='icon']") || document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = faviconInput.value || "https://google.com/favicon.ico";
      document.title = tabNameInput.value || "Vysterium";
    }
  });
  menu.appendChild(apply);
}

function createModule() {
  menu.innerHTML = "";

  let backButton = document.createElement("button");
  backButton.textContent = "Back to modules list";
  backButton.addEventListener("click", home);
  menu.appendChild(backButton);

  let nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.placeholder = "Module name";
  nameInput.style.width = "100%";
  nameInput.style.padding = "10px";
  nameInput.style.boxSizing = "border-box";
  nameInput.style.marginBottom = "20px";
  nameInput.style.borderRadius = "10px";
  nameInput.style.border = "none";
  menu.appendChild(nameInput);

  let descriptionInput = document.createElement("input");
  descriptionInput.type = "text";
  descriptionInput.placeholder = "Module description";
  descriptionInput.style.width = "100%";
  descriptionInput.style.padding = "10px";
  descriptionInput.style.boxSizing = "border-box";
  descriptionInput.style.marginBottom = "20px";
  descriptionInput.style.borderRadius = "10px";
  descriptionInput.style.border = "none";
  menu.appendChild(descriptionInput);

  let codeTextarea = document.createElement("textarea");
  codeTextarea.placeholder = "Module code";
  codeTextarea.style.width = "100%";
  codeTextarea.style.height = "60%";
  codeTextarea.style.marginBottom = "20px";
  menu.appendChild(codeTextarea);

  let createButton = document.createElement("button");
  createButton.textContent = "Create module";
  createButton.addEventListener("click", () => {
    let newModule = { name: nameInput.value, description: descriptionInput.value, "function": codeTextarea.value, toggleable: false, active: false };
    customScripts.push(newModule);
    localStorage.setItem("customScripts", JSON.stringify(customScripts));
    modules.push(newModule);
    home();
  });
  menu.appendChild(createButton);
}

function isDefaultModule(module) {
  // Define the names of the default modules
  const defaultModuleNames = ["RunJS", "ChangeURL", "CreateModule", "TabManager"];
  return defaultModuleNames.includes(module.name);
}

function deleteModule(index) {
  const module = modules[index];
  if (isDefaultModule(module)) {
    return;
  }
  modules.splice(index, 1);
  customScripts.splice(index, 1);
  localStorage.setItem("customScripts", JSON.stringify(customScripts));
  saveLoadedModules();
  renderModules();
}

function renderModules() {
  moduleContainer.innerHTML = "";
  modules
    .filter((module) => module.name.toLowerCase().includes(searchInput.value.toLowerCase()))
    .forEach((module, index) => {
      if (isDefaultModule(module)) {
        module.active = true; // Activate default modules
      }
      let moduleRow = document.createElement("div");
      moduleRow.classList.add("module-row");

      let moduleElement = document.createElement("div");
      moduleElement.classList.add("module-element");
      moduleElement.innerHTML = module.name + "<br>" + module.description;
      moduleElement.style.backgroundColor = module.active ? "rgba(255, 255, 255, 0.7)" : "transparent";
      moduleElement.style.color = module.active ? "#FFF" : "#333";

      moduleElement.addEventListener("click", () => {
        if (typeof module["function"] === "function") {
          module["function"]();
        } else {
          eval(module["function"]);
        }
      });

      moduleRow.appendChild(moduleElement);

      if (!isDefaultModule(module)) {
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
          deleteModule(index);
        });
        moduleRow.appendChild(deleteButton);
      }

      moduleContainer.appendChild(moduleRow);
    });
}

function saveModules() {
  localStorage.setItem("customScripts", JSON.stringify(customScripts));
  saveLoadedModules();
}

function saveLoadedModules() {
  let loadedModuleNames = modules.filter((module) => module.active).map((module) => module.name);
  localStorage.setItem("loadedModules", JSON.stringify(loadedModuleNames));
}

let overlay = document.createElement("div");
overlay.id = "overlay";
document.body.appendChild(overlay);

let menu = document.createElement("div");
menu.id = "menu";
document.body.appendChild(menu);

let searchInput = document.createElement("input");
searchInput.id = "search-input";
searchInput.type = "text";
searchInput.placeholder = "Search for a module...";
menu.appendChild(searchInput);

searchInput.addEventListener("input", () => {
  renderModules();
});

let moduleContainer = document.createElement("div");
menu.appendChild(moduleContainer);

let importButtonDiv = document.createElement("div");
importButtonDiv.classList.add("import-export-button-div");

let importButtonLabel = document.createElement("label");
importButtonLabel.classList.add("import-export-button-label");
importButtonLabel.textContent = "Import Script"; // Updated label text
importButtonDiv.appendChild(importButtonLabel);

let importButton = document.createElement("button");
importButton.classList.add("import-export-button");
importButton.textContent = "Import";
importButton.addEventListener("click", () => importInput.click());
importButtonDiv.appendChild(importButton);

let importInput = document.createElement("input");
importInput.type = "file";
importInput.style.display = "none";
importInput.addEventListener("change", async () => {
  let file = importInput.files[0];
  if (!file) return;
  let fileText = await file.text();
  let newScripts;
  try {
    newScripts = JSON.parse(fileText);
  } catch (e) {
    console.error("Invalid JSON file:", e);
    return;
  }
  customScripts = [...customScripts, ...newScripts];
  localStorage.setItem("customScripts", JSON.stringify(customScripts));
  modules = [...modules, ...newScripts];
  renderModules();
});
importButtonDiv.appendChild(importInput);

menu.appendChild(importButtonDiv);

let exportButtonDiv = document.createElement("div");
exportButtonDiv.classList.add("import-export-button-div");

let exportButtonLabel = document.createElement("label");
exportButtonLabel.classList.add("import-export-button-label");
exportButtonLabel.textContent = "Export Script"; // Updated label text
exportButtonDiv.appendChild(exportButtonLabel);

let exportButton = document.createElement("button");
exportButton.classList.add("import-export-button");
exportButton.textContent = "Export";
exportButton.addEventListener("click", () => {
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customScripts));
  let downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "modules.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
});
exportButtonDiv.appendChild(exportButton);

menu.appendChild(exportButtonDiv);

renderModules();

document.addEventListener("keydown", (event) => {
  if (event.code === "ShiftRight") {
    overlay.style.opacity = "1";
    overlay.style.pointerEvents = "auto";
    menu.style.transform = "translate(-50%, -50%) scale(1)";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    overlay.style.opacity = "0";
    overlay.style.pointerEvents = "none";
    menu.style.transform = "translate(-50%, -50%) scale(0)";
    home();
  }
});

function loadModules() {
  loadedModules.forEach((moduleName) => {
    const module = modules.find((m) => m.name === moduleName);
    if (module) {
      module.active = true;
    }
  });
}

loadModules();`
const styles = `
    body {
        margin: 0;
        padding: 0;
    } 

  #overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    top: 0;
    left: 0;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.5s;
    z-index: 9999;
  }

  #menu {
    position: fixed;
    width: 50%;
    height: 80%;
    background-color: #2c3e50;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0);
    transition: transform 0.5s;
    padding: 20px 40px;
    box-sizing: border-box;
    border-radius: 20px;
    overflow-y: auto;
    font-family: "Product Sans", Arial, sans-serif;
    font-size: 18px;
    color: #FFF;
    z-index: 10000;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    outline: 2px solid white;
  }

  #search-input {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    margin-bottom: 30px;
    border-radius: 10px;
    border: none;
    background-color: #FFF;
    color: #333;
  }

  .module-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .module-element {
    flex: 1 1 auto;
    display: inline-block;
    padding: 10px;
    background-color: rgba(255, 255, 255, 0.7);
    color: #FFF;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    text-align: center;
  }

  .delete-button {
    background-color: #e74c3c;
    color: #FFF;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    margin-left: 10px;
    cursor: pointer;
  }

  .import-export-button-div {
    margin-bottom: 20px;
  }

  .import-export-button-label {
    color: #FFF;
  }

  .import-export-button {
    background-color: #3498db;
    color: #FFF;
  };
  `
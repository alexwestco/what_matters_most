document.addEventListener("DOMContentLoaded", listExtensions);

function listExtensions() {
  let newTabExtensions = [];
  let options = document.querySelector("#options");

  chrome.management.getAll(function (response) {
    response.sort(compare);

    response.forEach((installedExtension) => {
      installedExtension.permissions.forEach((permission) => {
        if (permission === "newTabPageOverride") {
          //chrome.extension.getBackgroundPage().console.log(installedExtension.name);
          newTabExtensions.push({
            name: installedExtension.name,
            description: installedExtension.description,
            id: installedExtension.id,
          });
        }
      });
    });

    checkboxes = [];
    extensions = [];

    chrome.storage.sync.get("extensions", function (data) {
      //chrome.extension.getBackgroundPage().console.log('Now ------------------> extensions are ')

      storageExtensions = data.extensions;
      //chrome.extension.getBackgroundPage().console.log(extensions)

      newTabExtensions.forEach((extension) => {
				let option = document.createElement("div");
        option.classList.add("option");
				
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = "value";
        checkbox.classList.add("extension");
        checkbox.dataset.name = extension.name;
        checkbox.id = extension.id;
        checkbox.checked = storageExtensions.filter(
          (i) => i.id === extension.id
        ).length;

        let label = document.createElement("label");
        label.htmlFor = extension.id;
        label.innerHTML = `${extension.name.bold()}: ${extension.description}`;

        checkboxes.push(checkbox);

        option.appendChild(checkbox);
				option.appendChild(label);
				
				options.appendChild(option)
      });
    });
  });

  document.querySelector("#btn").onclick = function () {
    let extensionsToSwitch = [];

    document.querySelectorAll("input.extension").forEach((option) => {
      if (option.checked)
        extensionsToSwitch.push({
          id: option.id,
          name: option.dataset.name,
        });
    });

    console.log(extensionsToSwitch);

    chrome.runtime.sendMessage({ extensionsToSwitch }, function (response) {});

    //chrome.extension.getBackgroundPage().console.log(checkboxes)
  };
};

const compare = (a, b) => {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
};

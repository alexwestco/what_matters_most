var extensions = [];

chrome.storage.sync.get("extensions", function (data) {
  console.log("Now ------------------> extensions are ");
  extensions = data.extensions;
});

var indexOfEnabledExtension = 0;

chrome.tabs.onCreated.addListener(function () {
  indexOfEnabledExtension = ++indexOfEnabledExtension % extensions.length;

  let idToDisable;
  let idToEnable;

  extensions = extensions.map(({ id, name, isActive }, idx) => {
    if (isActive) {
      idToDisable = id;
      return { id, name, isActive: false };
    }
    if (idx === indexOfEnabledExtension) {
      idToEnable = id;
      return { id, name, isActive: true };
    }

    return { id, name, isActive };
  });

  chrome.management.setEnabled(idToEnable, true, function () {
    console.log(`%c enabled ${idToEnable}`, "color: green");
  });

  chrome.management.setEnabled(idToDisable, false, function () {
    console.log(`%c disabled ${idToDisable}`, "color: red");
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  extensions = [];

  indexOfEnabledExtension = 0;

  console.log('Selected Extensions:', request.ids);

  // disable all extensions
  request.ids.forEach((id) =>
    chrome.management.setEnabled(id, false, () => {})
  );

  for (i = 0; i < request.ids.length; i++) {
    if (request.checked[i]) {
      extensions.push({
        id: request.ids[i],
        name: request.names[i],
        isActive: false,
      });
    }
  }

  chrome.management.setEnabled(request.ids[0], true, () => {});
  extensions[0].isActive = true;

  alert(`Extensions will loop in this order:
    ${extensions.map(e => e.name).join('\n')}
  `);

  chrome.storage.sync.set({ extensions: extensions });

  sendResponse({ farewell: "goodbye" });
});

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
  extensions = request.extensionsToSwitch.map(i => {i.isActive = false; return i});

  console.log(extensions)

  indexOfEnabledExtension = 0;

  console.log('Selected Extensions:', request.ids);
  
  // disable all extensions
  chrome.management.setEnabled(extensions[0].id, true, () => {});
  extensions[0].isActive = true;

  extensions.forEach(({id}) =>
    chrome.management.setEnabled(id, false, () => {})
  );

  alert(`
    Extensions will loop in this order:
    \n
    ${extensions.map(e => e.name).join('\n')}
  `.replace(/  +/g, ''));

  chrome.storage.sync.set({ extensions: extensions });

  sendResponse({ farewell: "goodbye" });
});

chrome.tabs.onCreated.addListener(function() {
	//alert('hi')
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    console.log(request.ids)
    console.log(request.checked)

    sendResponse({farewell: "goodbye"})

  });
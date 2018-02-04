var extensions = [];
var indexOfEnabledExtension = 0;

chrome.tabs.onCreated.addListener(function() {
	for(i=0; i<extensions.length; i++){
		if(indexOfEnabledExtension == extensions.length-1){
			chrome.management.setEnabled($extensions[$indexOfEnabledExtension], false, function() {});
			chrome.management.setEnabled($extensions[0], true, function() {});
			$indexOfEnabledExtension = 0;
		}
		chrome.management.setEnabled($extensions[$indexOfEnabledExtension], false, function() {});
		chrome.management.setEnabled($extensions[$indexOfEnabledExtension+1], true, function() {});	
		$indexOfEnabledExtension ++;
	}
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	$extensions = [];
  	$indexOfEnabledExtension = 0;

    console.log(request.ids)

    for(i=0; i<request.ids.length; i++){
    	chrome.management.setEnabled(request.ids[i], false, function() {});
    }

    for(i=0; i<request.ids.length; i++){
    	if(request.checked[i]){
    		extensions.push(request.ids[i])
    		chrome.management.setEnabled(request.ids[i], true, function() {
	    		
	   		});

	   		break;
    	}
    	
    }

    sendResponse({farewell: "goodbye"})

  });
var extensions = [];
var indexOfEnabledExtension = 0;

var number = 0;

function test_prime(n) {

	if (n===1) {
    	return false;
	}
  	else if(n === 2) {
    	return true;
  	}else{
    	for(var x = 2; x < n; x++) {
      		if(n % x === 0){
        		return false;
      		}
    	}
    	return true;  
  	}

}

chrome.tabs.onCreated.addListener(function() {
	console.log("From here babaaay -->")
	console.log(extensions)

	if(number == 0){
		number = 1;
		console.log('bounce')
		return
	}

	console.log('no bounce')


	// Edge case
	if(indexOfEnabledExtension == extensions.length-1){

		console.log("Edge case")

		chrome.management.setEnabled(extensions[indexOfEnabledExtension], false, function() {
			console.log('disabled '+extensions[indexOfEnabledExtension])
		});
			
		chrome.management.setEnabled(extensions[0], true, function() {
			console.log('enabled '+ extensions[0])
			indexOfEnabledExtension = 0;
		});

		
		console.log('indexOfEnabledExtension is '+indexOfEnabledExtension)

	// Normal case
	}else{

		console.log("Normal case")

		chrome.management.setEnabled(extensions[indexOfEnabledExtension], false, function() {
			console.log('disabled '+extensions[indexOfEnabledExtension])
		});

		chrome.management.setEnabled(extensions[indexOfEnabledExtension+1], true, function() {
			console.log('enabled '+extensions[indexOfEnabledExtension+1])
			indexOfEnabledExtension ++;
		});

		
		console.log('indexOfEnabledExtension is '+indexOfEnabledExtension)

	}

	number = 0;

	chrome.tabs.query({ active:true, windowType:"normal", currentWindow: true }, function(d){ 
		console.log('id is '+d[0].id); 
		chrome.tabs.remove(d[0].id, function(callback){})
		chrome.tabs.create({ url: null });
	})

		
});


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
  	extensions = [];
  	indexOfEnabledExtension = 0;

    console.log(request.ids)

    for(i=0; i<request.ids.length; i++){
    	chrome.management.setEnabled(request.ids[i], false, function() {});
    }

    for(i=0; i<request.ids.length; i++){
    	if(request.checked[i]){
    		extensions.push(request.ids[i])
    	}
    	
    }

    for(i=0; i<request.ids.length; i++){
    	if(request.checked[i]){

    		chrome.management.setEnabled(request.ids[i], true, function() {
	    		
	   		});

	   		break;
    	}
    	
    }
    console.log('extensions-->')
    console.log(extensions)

    sendResponse({farewell: "goodbye"})

  });
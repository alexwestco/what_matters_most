var extensions = [];
var names = [];

chrome.storage.sync.get('extensions', function(data) {
	    //console.log('Now ------------------> extensions are ')
		extensions = data.extensions
	});


var indexOfEnabledExtension = 0;

var number = 0;



chrome.tabs.onCreated.addListener(function() {

	//console.log('extensions: ')
    //console.log(extensions)
    //console.log('names: ')
    //console.log(names)

	//console.log("From here babaaay -->")
	//console.log(extensions)

	//console.log('no bounce')


	// Edge case
	if(indexOfEnabledExtension == extensions.length-1){

		//console.log("Edge case")

		for(i=1; i<extensions.length-1; i++){
			chrome.management.setEnabled(extensions[i], false, function() {
				//console.log('disabled ' + names[i])
				indexOfEnabledExtension = 0;
			});
		}

		chrome.management.setEnabled(extensions[0], true, function() {
				//console.log('enabled ' + names[0])
				indexOfEnabledExtension = 0;
			});

		
		//console.log('indexOfEnabledExtension is '+indexOfEnabledExtension)

	// Normal case
	}else{

		//console.log("Normal case")
		//console.log('indexOfEnabledExtension is '+indexOfEnabledExtension)
		
		if(indexOfEnabledExtension==0){
			chrome.management.setEnabled(extensions[extensions.length-1], false, function() {
				//console.log('disabled ' + names[extensions.length-1])
			});
		}

		if(indexOfEnabledExtension>0){
			chrome.management.setEnabled(extensions[indexOfEnabledExtension-1], false, function() {
				//console.log('disabled ' + names[indexOfEnabledExtension-1])
			});
		}

		chrome.management.setEnabled(extensions[indexOfEnabledExtension+1], true, function() {
			//console.log('enabled '+names[indexOfEnabledExtension+1])
			indexOfEnabledExtension ++;
		});
		
		//console.log('indexOfEnabledExtension is '+indexOfEnabledExtension)

	}



	number = 0;
		
});



chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

  	var str = 'Extensions will loop in this order.\n\n'
  	extensions = [];
  	names = [];

  	indexOfEnabledExtension = 0;

    //console.log(request.ids)

    for(i=0; i<request.ids.length; i++){
    	chrome.management.setEnabled(request.ids[i], false, function() {});
    }

    for(i=0; i<request.ids.length; i++){
    	if(request.checked[i]){
    		str = '  ' + str + '--> ' + request.names[i] + '\n'
    		extensions.push(request.ids[i])
    		names.push(request.names[i])
    	}
    	
    }

    for(i=0; i<request.ids.length; i++){
    	if(request.checked[i]){

    		chrome.management.setEnabled(request.ids[i], true, function() {

	   		});

	   		break;
    	}
    	
    }

    //console.log('extensions: ')
    //console.log(extensions)
    //console.log('names: ')
    //console.log(names)

    //console.log('extensions-->')
    //console.log(extensions)

    chrome.storage.sync.set({ extensions: extensions });

    alert(str)

    sendResponse({farewell: "goodbye"})

  });
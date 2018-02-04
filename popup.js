

document.addEventListener('DOMContentLoaded', function() {
	var array=[];
	var options = document.getElementById('options');
	chrome.management.getAll(function(response) {
		for(i=0; i<response.length; i++){
			for(j=0; j<response[i].permissions.length; j++){
				if(response[i].permissions[j]=='newTabPageOverride'){
					console.log(response[i].name + ': '+response[i].description);
					array.push([response[i].name, response[i].description, response[i].id])
				}
			}
			
		}

		checkboxes = []
		names = []

		for(i=0; i<array.length; i++){
			var checkbox = document.createElement('input');

			checkbox.type = "checkbox";
			checkbox.name = "name";
			checkbox.value = "value";
			checkbox.id = array[i][2];

			var label = document.createElement('label')
			label.htmlFor = "id";
			label.innerHTML = array[i][0].bold()
			label.appendChild(document.createTextNode(' : '+array[i][1]));

			checkboxes.push(checkbox)
			names.push(array[i][0])

			options.appendChild(checkbox);
			options.appendChild(label);

			var br = document.createElement("br");
	        options.appendChild(br);

	        var br = document.createElement("br");
	        options.appendChild(br);

		}

	});

	document.getElementById('btn').onclick = function(){
		//chrome.extension.getBackgroundPage().console.log(checkboxes)
		
		var ids=[];
		var checked=[];

		for(i=0; i<checkboxes.length; i++){
			//chrome.extension.getBackgroundPage().console.log('checked: '+checkboxes[i].checked);
			
			ids.push(checkboxes[i].id)
			checked.push(checkboxes[i].checked)
		}

		chrome.runtime.sendMessage({ids: ids, checked: checked, names: names}, function(response) {
		  //alert(response);
		});

	}
	

});

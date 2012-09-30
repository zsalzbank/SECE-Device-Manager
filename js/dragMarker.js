var geocoder;
var map;
var panorama;
var objName;
var markersArray = [];

$(function(){
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(40.809038567298586, -73.96126449108124);
	var myOptions = {
			zoom: 5,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
});

function placeLink(){
	var name = document.getElementById('SOname').value;	
	if (name.indexOf(" ") != -1 )
		alert("Enter Name of the object without any spaces");
	else{
		document.getElementById("placeObj").innerHTML = "Click on the map to locate the smartObject:<h3>"+name+"</h3>"; 
	 	google.maps.event.addListener(map, "click", function(event){
		 	marker = new google.maps.Marker({
	        position: event.latLng, 
	        map: map
	     	});
	    	initApp(event.latLng);
	    	markersArray[0] = marker;
	    	document.getElementById("placeObj").innerHTML += "<br>"; 
	    });
	}
}

function initApp(latLng){
	//Check if street view is available for the location where the user is palcing the smart object	
	$("#hideDiv").html("");
	streetViewService = new google.maps.StreetViewService();
	var STREETVIEW_MAX_DISTANCE = 100;
	streetViewService.getPanoramaByLocation(latLng, STREETVIEW_MAX_DISTANCE, function (streetViewPanoramaData, status) {
    	if (status === google.maps.StreetViewStatus.OK) {
        	// ok
			var panoramaOptions = {
	                position: latLng,
	                pov: {
	                heading: 34,
	                pitch: 10,
	                zoom: 1
	                }
	        };
	        panorama = new  google.maps.StreetViewPanorama(document.getElementById("pano"),panoramaOptions);
	                        map.setStreetView(panorama);
	        map.setStreetView(panorama);
		  	var streetMarker = new google.maps.Marker({
	                map: panorama,
	                position: latLng,
	                title: "streetMarker",
	                draggable: true
	        });
	        $("#map_canvas").addClass("span6");
	        $("#pano").addClass("span6");
		} 
	});
/*
	var panoramaOptions = {
          	position: latLng,
                pov: {
                heading: 34,
                pitch: 10,
                zoom: 1
                }
      	};
     	panorama = new  google.maps.StreetViewPanorama(document.getElementById("pano"),panoramaOptions);
                        map.setStreetView(panorama);
	map.setStreetView(panorama);	
*/
	var marker = new google.maps.Marker({
		map: map, 
		position: latLng,
		title: "mapMarker",
		draggable: true
	});

	var streetMarker = new google.maps.Marker({
		position: latLng,
		title: "streetMarker",
		draggable: true
	});
	
	updateMarkerPosition(latLng);
	geocodePosition(latLng);	
	//for normal marker movement		
	google.maps.event.addListener(marker, 'dragstart', function() {
		//do nothing
	});

	google.maps.event.addListener(marker, 'drag', function() {
		//updating marker position
		updateMarkerPosition(marker.getPosition());
		streetMarker.position = marker.getPosition();
	});

	google.maps.event.addListener(marker, 'dragend', function() {
		//updating marker position
		geocodePosition(marker.getPosition());
		map.setCenter(marker.getPosition());
		panorama.setPosition(marker.getPosition());
	});

	updateMarkerPosition(latLng);
	geocodePosition(latLng);	
	//for streetview marker movement		
	google.maps.event.addListener(streetMarker, 'dragstart', function() {
	});

	google.maps.event.addListener(streetMarker, 'drag', function() {
		updateMarkerPosition(streetMarker.getPosition());
		marker.position = streetMarker.getPosition();
	});

	google.maps.event.addListener(streetMarker, 'dragend', function() {
		geocodePosition(streetMarker.getPosition());
		map.setCenter(StreetMarker.getPosition());
		panorama.setPosition(streetMarker.getPosition());
	});
}

function geocodePosition(pos) {

	geocoder.geocode({
		latLng: pos
	}, function(responses) {
		if (responses && responses.length > 0) {
			updateMarkerAddress(responses[0].formatted_address);
		} else {
			updateMarkerAddress('Cannot determine address at this location.');
		}
	});
}

function updateMarkerPosition(latLng) {
	var sobj = document.getElementById("SOname").value;
	document.getElementById('placeObj').innerHTML = "<form id = \"markerLocation\" action = \"addSObj.php\" method = \"post\"><br><input type = \"hidden\" id = \"lat\" name = \"lat\" value = " +
	latLng.lat()+"><br>"+
	"<input type = \"hidden\" id = \"lng\" name = \"lng\" value = " +
	latLng.lng()+">"+ "<input type = \"hidden\" id = \"name\" name = \"name\" value = "+sobj+">"+"<br><input type = \"submit\" value = \"Locate!\">" +"</form>";
}


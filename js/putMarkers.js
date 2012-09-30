var geocoder;
var map;
var panorama;
var sObj = [];

//constructor for the smartObject
function smartObj(id, name, lat, lng, marker,infowindow){
	this.id = id;
	this.name = name;
	this.lat = lat;
	this.lng = lng;
	this.infoWindow = null;
	this.marker = null;
	this.displayProps = displayProps;
}

//Initializes the SmartObjects owned by the user returned by the database in validate.php
$(function(){
	var i = 1;

	while(document.getElementById(i) != null){
		var values = [];
		values[i] = document.getElementById(i).value;

		var indVals = values[i].split(":",5);

		sObj[i] = new smartObj(indVals[0],indVals[1], indVals[2], indVals[3]);
		//Debugging
		//sObj[i].displayProps();
		i++;
	}

	initialize();
});

//to show object properties (DEBUGING)
function displayProps(){
	alert("in display properties");	
	alert(this.name);
	alert(this.lat);
	alert(this.lng);

}

//Initialize markers on the map to view all smartObjects owned by the user who is logged in. Also initialise the marker attribute of the smartObject object
function initMarkers(){

	var latlng = new google.maps.LatLng(this.lat, this.lng);
	this.marker = new google.maps.Marker({
		map: map,
		position: latlng,
		title: "mapmaker",
		draggable: true
	});
}

function addSObjects(){
	var k = sObj.length;
}

//To geocode the given address
function geocodeAddress(pos){
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


//Initialize the map on loading the SECE website
function initialize() {
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(40.809038567298586, -73.96126449108124);
	var myOptions = {
			zoom: 14,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	}

	var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	var marker = [];
	var infoWindow = [];
	for(var k = 1 ; k < sObj.length; k++){
		latlng = new google.maps.LatLng(sObj[k].lat,sObj[k].lng);

		marker[k] = new google.maps.Marker({
			position: latlng, 
			map: map,
			title: sObj[k].id,
			animation: google.maps.Animation.DROP
		}); 

		infoWindow[k] = new google.maps.InfoWindow({
			content: sObj[k].name
		});

		google.maps.event.addListener(marker[k], "click", function(k) {
			return function(){
				infoWindow[k].open(map, marker[k]);
			}
		}(k));
	}
	/*
	for(var k = 1 ; k < sObj.length; k++){
		var cont = sObj[k].name;
		var mark = marker[k];
		//alert(marker[k].title);
		google.maps.event.addListener(mark, 'click', function() {
			//alert(mark.title);
			infoWindow[k] = new google.maps.InfoWindow({
				content: cont
			});
			//alert(infoWindow[k].content);
			var temp = infoWindow[k]; 
			temp.open(map,mark);
		});		
	}
	 */
	latlng = new google.maps.LatLng(sObj[sObj.length-1].lat, sObj[sObj.length-1].lng);

	map.setCenter(latlng);

	map.setZoom(11);
}


//Reorient the map to the address searched by the user
function getAddress(add) {
	var address = document.getElementById("address").value;

	//initmap();
	geocoder.geocode( { 'address': address}, function(results, status) {

		if (status == google.maps.GeocoderStatus.OK) {
			var latLng = results[0].geometry.location;
			map.setCenter(results[0].geometry.location);
			map.setZoom(17);

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
			if(add){

				initApp();
			}
		} else {
			alert("Geocode was not successful for the following reason: " + status);
		}
	});
}

function initmap(){
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(40.809038567298586, -73.96126449108124);
	var myOptions = {
			zoom: 3,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

}

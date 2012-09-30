/* Author: Riddhi Mehta
*/

$(function(){
   	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(40.809038567298586, -73.96126449108124);
	var myOptions = {
			zoom: 3,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	initObj();
});

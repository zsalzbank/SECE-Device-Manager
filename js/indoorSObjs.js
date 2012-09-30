var map, lat1, lng1, lat2, lng2, x1, y1, x2, y2;
var mapping = "";
var markersArray = [];
var marker;
var ipix = 1;
var iln = 1;

function getPixel(event){
	var x = event.pageX;
	var y = event.pageY;

	if(iln == 2)
		document.getElementById("disp-points1").innerHTML += "<div id = '"+iln+"' onclick = 'deleteSelection("+iln+")'><br><i class='icon-trash'></i>("+lat1+","+lng1+")-->("+x+","+y+")</div>";
	else if(iln == 3)
		document.getElementById("disp-points2").innerHTML += "<div id = '"+iln+"' onclick = 'deleteSelection("+iln+")'><br><i class='icon-trash'></i>("+lat2+","+lng2+")-->("+x+","+y+")</div>";
	
	if(ipix == 1){
		x1 = x;
		y1 = y;
		ipix++;
	}
	else{
		x2 = x;
		y2 = y;
		mapping = lat1+","+lng1+";"+x1+","+y1+":"+lat2+","+lng2+";"+x2+","+y2;
		document.getElementById("latlng").value = mapping;
		pixDist = Math.sqrt((x1 - x2)*(x1 - x2) + (y1-y2)*(x1 - x2));
		document.getElementById("pixDist").value = pixDist;
		
	}		
}

function initialize(){
	
	document.getElementById("img").onclick = getPixel;
	
	var latlng = new google.maps.LatLng(40.809038567298586, -73.96126449108124);
	var myOptions = {
			zoom: 1,
			center: new google.maps.LatLng(0,0),
			mapTypeId: google.maps.MapTypeId.ROADMAP
	}

	map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
	   
   	google.maps.event.addListener(map, "click", function(event){
        // place a marker
        placeMarker(event.latLng);

		if(iln == 1){
			markersArray[0] = marker;
			latlng1 = event.latLng;
			lat1 = latlng1.lat();
			lng1 = latlng1.lng();
			iln++;
		}
		else if (iln == 2){
			markersArray[1] = marker; 
			latlng2 = event.latLng;
			lat2 = latlng2.lat();
			lng2 = latlng2.lng();
			iln++;
			var R = 6371;
			var dLat = (lat2-lat1)* (Math.PI/180);
			var dLon = (lng2-lng1)* (Math.PI/180);
			var deglat1 = lat1* (Math.PI/180);
			var deglat2 = lat2* (Math.PI/180);

			var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(deglat1) * Math.cos(deglat2); 
			var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
			var d = R * c;
			
			document.getElementById("actDist").value = d;
			
		}
    });
}

function deleteSelection(delIndex){
	document.getElementById(delIndex).innerHTML = "";
	if(iln == 2){
		lat1 = lat2;
		lng1 = lng2;
		x1 = x2;
		y1 = y2;
		markersArray[0].setMap(null);
	}
	else if(iln == 3){
		markersArray[1].setMap(null);
	}
	document.getElementById(delIndex).setAttribute("id","null");
	iln--;
	ipix--;
}

function placeMarker(location) {
	 marker = new google.maps.Marker({
         position: location, 
         map: map
     });
}

function deleteOverlays() {
     if (markersArray) {
         for (i in markersArray) {
             markersArray[i].setMap(null);
         }
     markersArray.length = 0;
     }
}
 
function clearpt(){
	document.getElementById("disp-points1").innerHTML = "";
	document.getElementById("disp-points2").innerHTML = "";
	document.getElementById("latlng").value = "";
	mapping = "";
	iln = 1;
	ipix = 1;
	deleteOverlays();
}
var sObjPosnlatlng = "", sObjPosnpix = "";
var R = 6371;
var x1,y1,x2,y2, x, y;
var lat1, lng1, lat2, lng2, sObjposnLat, sObjposnLng;
var heading;
var pixToDist;

function getPixel(event){
	x = event.pageX;
	y = event.pageY;
	var latLngFin = latLngXlate(x,y);

	document.getElementById("pixels").innerHTML += latLngFin+",";

	sObjPosnlatlng = latLngFin.lat()+","+latLngFin.lng();
	sObjposnLat =  latLngFin.lat();
	sObjposnLng = latLngFin.lng();
	sObjPosnpix = x + ","+ y;
	document.getElementById("hidden").innerHTML = "<input type = \"hidden\" id = \"sopositionlatlng\" name = \"sopositionlatlng\" value = '"+sObjPosnlatlng+"'><input type = \"hidden\" id = \"sopositionpix\" name = \"sopositionpix\" value = '"+sObjPosnpix+"'>";
}

function init(){
	document.getElementById("img").onclick = getPixel;
	
	x1 = document.getElementById("pxX1").value;
	x2 = document.getElementById("pxX2").value;
	y1 = document.getElementById("pxY1").value;
	y2 = document.getElementById("pxY2").value;

	lat1 = parseFloat(document.getElementById("lat1").value);
	lat2 = document.getElementById("lat2").value;
	lng1 = parseFloat(document.getElementById("lng1").value);
	lng2 = document.getElementById("lng2").value;

	pixDist = document.getElementById("pixDist").value;
	actDist = document.getElementById("actDist").value;
	
	latlng1 = new google.maps.LatLng(lat1,lng1);
	latlng2 = new google.maps.LatLng(lat2,lng2);

	heading = google.maps.geometry.spherical.computeHeading(latlng1, latlng2);
	pixToDist = actDist / pixDist;

	if(document.getElementById("source") != null)
		alert(document.getElementById("source").value);
}

function latLngXlate(x3,y3){
	var m1 = (y1-y2)/ (x1-x2);

	var m2;
	
	if(x1 == x3 && y1 == y3)
		m2 = (y2-y3)/ (x2-x3);	
	else
		m2 = (y1-y3)/ (x1-x3);
	var intrAngle = Math.atan((m2 - m1)/ (1+ m1*m2)) * (180/Math.PI);
	
 	var indvHeading = heading + intrAngle;

 	d = Math.sqrt((x1-x3)*(x1-x3) + (y1-y3)*(y1-y3)) * pixToDist/1000;

	dx = d*Math.sin(indvHeading);
	dy = d*Math.cos(indvHeading);

	lat3 = lat1 + dy/110540;

	lng3 = lng1 + dx/(111320*Math.cos(lat1));
	
    var latlng3 = new google.maps.LatLng(lat3,lng3);
    return latlng3;
}

function clearpt(){
	document.getElementById("pixels").innerHTML = "";
	currentRoom = "";
}

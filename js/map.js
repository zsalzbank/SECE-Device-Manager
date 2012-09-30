(function(exports) {
  var dm = exports;
  var gcdr, columbia, map, openWindow = null;


  function initializeMap() {
    gcdr = new google.maps.Geocoder();  
    columbia = new google.maps.LatLng(40.809038567298586, -73.96126449108124);

    map = new google.maps.Map($("#map_canvas").get(0), {
      zoom: 11,
      center: columbia,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
  }

  dm.addDevice = function(device) {
    var pos = new google.maps.LatLng(device.latitude, device.longitude);
    var info = new google.maps.InfoWindow({
      content: device.name
    });
    var marker = new google.maps.Marker({
      position: pos,
      map: map,
      title: device.name,
      animation: google.maps.Animation.DROP
    });

    var mapDevice = {
      show: function() {
        if(openWindow) openWindow.close();
        info.open(map, marker);
        openWindow = info;
      }
    }

    google.maps.event.addListener(marker, "click", function() {
      mapDevice.show();
    });

    return mapDevice;
  }

  initializeMap();
})(DeviceMap = {});

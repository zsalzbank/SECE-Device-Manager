(function(exports) {
  var dm = exports;
  var markers = {};
  var openWindow = null;
  var visible = true, altitude = -1;
  var extraGenerator = null, searchText = "";

  dm.setExtra = function(e) {
    extraGenerator = e;
  }

  dm.setAltitude = function(alt) {
    altitude = alt;
    update();
  }

  dm.search = function(text) {
    searchText = text;
    update();
  }

  function update() {
    dm.toggle(visible);
  }

  function generateDeviceContent(device) {
    var $div = $("<div></div>");
    $div.append("<h5>" + device.name + "</h5>");

    return $div;
  }

  function inSearchResults(device) {
    if(!visible) {
      return false;
    } else if(altitude != -1 && (device.altitude > altitude + 5 || device.altitude < altitude - 5)) {
      return false;
    } else if(device.name.indexOf(searchText) == -1) {
      return false;
    }
    return true;
  }

  function addDevice(device) {
    var content = generateDeviceContent(device);
    var pos = new google.maps.LatLng(device.latitude, device.longitude);

    var infoWindow = new google.maps.InfoWindow({
      content: content.html()
    });

    var marker = new google.maps.Marker({
      position: pos,
      map: inSearchResults(device) ? Map.objs.map : null,
      title: device.name
    });

    google.maps.event.addListener(marker, "click", function() {
      if(openWindow) openWindow.close();
      infoWindow.open(Map.objs.map, marker);
      openWindow = infoWindow;
    });

    google.maps.event.addListener(infoWindow, "closeclick", function() {
      openWindow = null;
    });

    var extra = (extraGenerator == null) ? null : extraGenerator(device);
    if(extra != null && !inSearchResults(device)) {
      extra.hide();
    }

    markers[device.id] = {
      device: device,
      marker: marker,
      infoWindow: infoWindow,
      extra: extra
    };
  }

  dm.drawDevices = function(devices) {
    $(devices).each(function(i, device) {
      device = device.device;

      if(!(device.id in markers)) {
        addDevice(device);
      }
    });
  }

  function setMarkerMap(m) {
    for (i in markers) {
      var visible = inSearchResults(markers[i].device);
      if(visible && m != null) {
        markers[i].marker.setMap(m);
        if(markers[i].extra != null) {
          markers[i].extra.show();
        }
      } else {
        dm.removeDevice(markers[i].device, false);
      }
    }
  }

  dm.removeDevice = function(device, deleteIt) {
    markers[device.id].marker.setMap(null);
    markers[device.id].infoWindow.close();
    if(markers[device.id].extra != null) {
      markers[device.id].extra.hide();
    }

    if(deleteIt) {
      if(markers[device.id].extra != null) {
        markers[device.id].extra.remove();
      }
      
      delete markers[device.id];
    }
  }

  dm.toggle = function(v) {
    if(typeof v === "undefined") v = !visible;

    visible = v;

    if(v) {
      setMarkerMap(Map.objs.map);
    } else {
      setMarkerMap(null);
    }
  }
})(DeviceMap = {});

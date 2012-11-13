(function(exports) {
  var dm = exports;
  var markers = [];
  var openWindow = null;
  var visible = true;

  dm.addDevice = function(device) {
    var $wc = $("<div></div>");
    var $del = $('<a id="del' + device.id + '" href="#" class="btn btn-danger">Delete</a>');
    $("#del" + device.id).die("click").live("click", function() {
      DeviceAPI.deleteDevice(device.id, function(data, status) {
        if(status == "success") {
          dm.loadDevices();
        } else {
          alert("Error deleting!");
        }
      });
    });
    var $near = $('<a id="near' + device.id + '" href="#" class="btn btn-primary">Within 5 km</a>');
    $("#near" + device.id).die("click").live("click", function() {
	dm.loadNear(device.id, 5000);
    });

    $wc.append("<h5>" + device.name + "</h5>");
    $wc.append($near);
    $wc.append($del);

    var pos = new google.maps.LatLng(device.latitude, device.longitude);
    var info = new google.maps.InfoWindow({
      content: $wc.html()
    });
    var marker = new google.maps.Marker({
      position: pos,
      map: (visible) ? Map.objs.map : null,
      title: device.name,
      animation: google.maps.Animation.DROP
    });

    var mapDevice = {
      show: function() {
        if(openWindow) openWindow.close();
        info.open(Map.objs.map, marker);
        openWindow = info;
      }
    }

    google.maps.event.addListener(marker, "click", function() {
      mapDevice.show();
    });

    markers.push(marker);

    return mapDevice;
  }

  dm.loadDevices = function() {
    setMarkerMap(null);
    markers = [];

    DeviceAPI.getDevices({}, function(data) {
      $.each(data, function(i, device) {
        var md = dm.addDevice(device.device);
      });
    });
  }

  dm.loadNear = function(id, distance) {
    setMarkerMap(null);
    markers = [];

    DeviceAPI.getDevices({
      id: id,
      distance: distance
    }, function(data) {
      $.each(data, function(i, device) {
        var md = dm.addDevice(device.device);
      });
    });
  }

  function setMarkerMap(m) {
    for (i in markers) {
      markers[i].setMap(m);
    }
  }

  dm.toggle = function(v) {
    if(typeof v === "undefined") v = !visible;

    if(v) {
      setMarkerMap(Map.objs.map);
    } else {
      setMarkerMap(null);
    }

    visible = v;
  }

})(DeviceMap = {});

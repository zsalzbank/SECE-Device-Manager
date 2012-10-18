(function(exports) {
  var dm = exports;
  var $add, $addnext, $error;
  var columbia, markers = [];
  var openWindow = null, addShowing = false, addMarker = null, mapEvent = null;

  dm.initialize = function() {
    $add = $("#sidebar");
    $addnext = $("#add-continue");
    $error = $add.find(".error");

    columbia = new google.maps.LatLng(40.809038567298586, -73.96126449108124);

    Map.objs.map.setCenter(columbia);
  }

  function setMarkerMap(m) {
    for (i in markers) {
      markers[i].setMap(m);
    }
  }

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
      map: Map.objs.map,
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

    DeviceAPI.getDevices(function(data) {
      $.each(data, function(i, device) {
        var md = dm.addDevice(device.device);
      });
    });
  }

  dm.loadNear = function(id, distance) {
    setMarkerMap(null);
    markers = [];

    DeviceAPI.getNear(id, distance, function(data) {
      $.each(data, function(i, device) {
        var md = dm.addDevice(device.device);
      });
    });
  }

  function removeAddMarker() {
    if(addMarker != null) {
      addMarker.setMap(null);
      addMarker = null;
    }
  }

  function showAddStep(i) {
    $add.find(".step").hide();
    $($add.find(".step")[i]).show();
  }

  dm.toggleAddDevice = function() {
    if(addShowing) {
      google.maps.event.removeListener(mapEvent);
      Map.objs.pano.setVisible(false);
      $add.hide();
      $error.hide();
      setMarkerMap(Map.objs.map);
      removeAddMarker();
    } else {
      showAddStep(0);
      $addnext.hide();
      $add.show();
      setMarkerMap(null);

      mapEvent = google.maps.event.addListener(Map.objs.map, "click", function(event) {
        $addnext.unbind().click(addStep2);
        $addnext.show();
        removeAddMarker();
        addMarker = new google.maps.Marker({
          position: event.latLng, 
          map: Map.objs.map
        });
      });
    }

    function addStep2() {
      Map.objs.sv.getPanoramaByLocation(addMarker.getPosition(), 50, function(data, status) {
        if(status == google.maps.StreetViewStatus.OK) {
          showAddStep(1);
          $addnext.unbind().click(addStep3);
          $error.hide();
          google.maps.event.removeListener(mapEvent);

          addMarker.setDraggable(true);

          Map.objs.pano.setPosition(addMarker.getPosition());
          Map.objs.pano.setVisible(true);
        } else {
          $error.html("The selected location is not valid").fadeIn();
        }
      });
    }

    function addStep3() {
      showAddStep(2);
      $addnext.unbind().click(addDone);

      addMarker.setDraggable(false);
    }

    function addDone() {
      var p = addMarker.getPosition();
      DeviceAPI.addDevice($("#add-name").val(), p.lat(), p.lng());

      dm.toggleAddDevice();
      dm.loadDevices();
    }

    addShowing = !addShowing;
  }
})(DeviceMap = {});

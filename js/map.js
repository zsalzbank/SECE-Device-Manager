(function(exports) {
  var dm = exports;
  var $canvas, $add, $addnext;
  var gcdr, columbia, map, pano, markers = [];
  var openWindow = null, addShowing = false, addMarker = null, mapEvent = null;

  function resize() {
    $canvas.height($(document).height() - $canvas.offset().top);
    google.maps.event.trigger(map, "resize");
  }

  function initializeMap() {
    $canvas = $("#map-canvas");
    $add = $("#sidebar");
    $addnext = $("#add-continue");

    gcdr = new google.maps.Geocoder();  
    columbia = new google.maps.LatLng(40.809038567298586, -73.96126449108124);

    map = new google.maps.Map($canvas.get(0), {
      zoom: 11,
      center: columbia,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    pano = map.getStreetView();

    $(window).resize(resize);

    resize();
  }

  function setMarkerMap(m) {
    for (i in markers) {
      markers[i].setMap(m);
    }
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
      pano.setVisible(false);
      $add.hide();
      setMarkerMap(map);
      removeAddMarker();
    } else {
      showAddStep(0);
      $addnext.hide();
      $add.show();
      setMarkerMap(null);

      mapEvent = google.maps.event.addListener(map, "click", function(event) {
        $addnext.unbind().click(addStep2);
        $addnext.show();
        removeAddMarker();
        addMarker = new google.maps.Marker({
          position: event.latLng, 
          map: map
        });
      });
    }

    function addStep2() {
      showAddStep(1);
      $addnext.unbind().click(addStep3);
      google.maps.event.removeListener(mapEvent);

      addMarker.setDraggable(true);

      pano.setPosition(addMarker.getPosition());
      pano.setVisible(true);
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

  initializeMap();
})(DeviceMap = {});

(function(exports) {
  var dc = exports;
  var $add, $addnext, $error;
  var openWindow = null, addMarker = null, mapEvent = null;

  dc.initialize = function() {
    $add = $("#sidebar");
    $addnext = $("#add-continue");
    $error = $add.find(".error");

    showAddStep(0);
    $addnext.hide();

    mapEvent = google.maps.event.addListener(Map.objs.map, "click", function(event) {
      $addnext.unbind().click(addStep2);
      $addnext.show();
      if(addMarker != null) {
        addMarker.setMap(null);
      }
      addMarker = new google.maps.Marker({
        position: event.latLng, 
        map: Map.objs.map,
        draggable: true
      });
    });
  }

  function showAddStep(i) {
    $add.find(".step").hide();
    $($add.find(".step")[i]).show();
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
        addMarker.setMap(null);
        $error.html("The selected location is not valid.").fadeIn();
      }
    });
  }

  function addStep3() {
    showAddStep(2);
    $addnext.unbind().click(addDone);

    addMarker.setDraggable(false);
    Map.objs.pano.setVisible(false);
  }

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function addDone() {
    $error.hide();
    
    var name = $("#add-name").val();
    var alt = $("#add-altitude").val();

    if (name == "") {
      $error.text("Please enter a valid name.").show();
      return;
    } else if (!isNumeric(alt)) {
      $error.text("Please enter a valid altitude.").show();
      return;
    }

    $addnext.unbind();

    var p = addMarker.getPosition();
    var device = {
      name: name,
      latitude: p.lat(),
      longitude: p.lng(),
      altitude: alt
    };
    DeviceAPI.addDevice(device, function(data) {
       if(data.success) {
         showAddStep(3);
         $addnext.hide();
       } else {
         $error.html("There was an error adding the device.").fadeIn();
       }
    });
  }
})(DeviceCreate = {});

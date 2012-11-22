(function(exports) {
  var dc = exports;
  var $rotation, $maptype, $options, $editor;
  var dm = null, marker = null, normalMode = true, infoWindow = null, infoWindowContent = null;
  var rotationEvent = null;

  dc.initialize = function() {
    $options = $("#editor-options");
    $editor = $("#device-editor");
    $rotation = $("#editor-rotation");
    $maptype = $("#editor-options .maptype");
    $("#editor-rotation .btn-danger").click(cancelDevice);
    $("#editor-rotation .btn-primary").click(showEditor);
    $("#editor-options .maptype").click(changeMapType);
    $("#editor-options .continue").click(showRotation);
    $("#editor-options .btn-danger").click(cancelDevice);
    $(".editor-form .btn-danger").live('click', cancelDevice);
    $(".editor-form .btn-primary").live('click', saveDevice);

    dm = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.MARKER
        ]
      }
    });

    google.maps.event.addListener(dm, 'markercomplete', doneDrawing);

    $(window).resize(winResize);
  }

  function showRotation() {
    $options.hide();
    $rotation.show();
    setNormalMode();

    var p = marker.getPosition();
    marker.setMap(null);

    marker = new RotatedMarker(p, 0, Map.objs.map);

    rotationEvent = google.maps.event.addListener(Map.objs.map, 'click', changeBearing);
  }

  function changeBearing(e) {
    var loc1 = marker.getPosition();
    var loc2 = e.latLng; 

    var dLon =(loc2.lng()-loc1.lng()).toRad();
    var y = Math.sin(dLon) * Math.cos(loc2.lat().toRad());
    var x = Math.cos(loc1.lat().toRad())*Math.sin(loc2.lat().toRad()) -
                Math.sin(loc1.lat().toRad())*Math.cos(loc2.lat().toRad())*Math.cos(dLon.toRad());
    var brng = Math.atan2(y, x) * 180 / Math.PI;

    marker.setRotation(brng);
  }

  function showEditor() {
    $rotation.hide();
    cancelRotation();

    infoWindow = new google.maps.InfoWindow({
      content: $editor.clone().html(),
      position: marker.getPosition()
    });

    google.maps.event.addListener(infoWindow, 'closeclick', cancelDevice);

    infoWindow.open(Map.objs.map);
  }

  function changeMapType() {
    if(normalMode) {
        $maptype.html("Normal");

        Map.objs.pano.setPosition(marker.getPosition());
        Map.objs.pano.setVisible(true);

        normalMode = false;
    } else {
        setNormalMode();
    }

  }

  function setNormalMode() {
    $maptype.html("Street View");

    if(marker != null) {
      Map.objs.map.setCenter(marker.getPosition());
    }

    Map.objs.pano.setVisible(false);

    normalMode = true;
  }

  function winResize() {
    $options.css({
      left: $(document).width()/2 - $options.width()/2 + 'px',
      top: ($("#map-canvas").offset().top + 10) + 'px'
    });
    $rotation.css({
      left: $(document).width()/2 - $rotation.width()/2 + 'px',
      top: ($("#map-canvas").offset().top + 10) + 'px'
    });
  }

  dc.start = function() {
    marker = null;
    Map.setDrawingManager(dm);
  }

  function cancelDevice() {
    if(infoWindow != null) {
        infoWindow.close();
        infoWindow = null;
    }

    cancelRotation();

    marker.setMap(null);
    dm.setOptions({ drawingControl: true });

    marker = null;
    $options.hide();
    $rotation.hide();

    setNormalMode();
  }

  function cancelRotation() {
    if(rotationEvent != null) {
      google.maps.event.removeListener(rotationEvent);
      roationEvent = null;  
    }
  }

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function saveDevice(e) {
    var b = $(e.target);
    var form = b.parent();
    infoWindowContent = form.parent();
    var $error = form.find(".error");

    $error.hide();
    b.show();

    var name = form.find("#add-name").val()
    var altitude = form.find("#add-altitude").val()

    if (name == "") {
      $error.text("Please enter a valid name.").show();
      return;
    } else if (!isNumeric(altitude)) {
      $error.text("Please enter a valid altitude.").show();
      return;
    }

    var p = marker.getPosition();
    var device = {
      name: name,
      latitude: p.lat(),
      longitude: p.lng(),
      altitude: altitude,
      bearing: marker.getRotation()
    };

    DeviceAPI.addDevice(device, deviceDone);
    b.hide();
  }

  function deviceDone(data) {
    if(data.success) {
      infoWindowContent.children().hide();
      infoWindowContent.find(".success").show();
    } else {
      infoWindowContent.find(".editor-form .error").text("There was an error saving.").show();
      infoWindowContent.find(".editor-form .btn-primary").show();
    }
  }

  function updateOptions() {
    Map.objs.sv.getPanoramaByLocation(marker.getPosition(), 50, function(data, status) {
      $maptype.toggle(status == google.maps.StreetViewStatus.OK);

      if(!normalMode && status != google.maps.StreetViewStatus.OK) {
        setNormalMode();
      }
    });
  }

  function doneDrawing(m) {
    marker = m;

    dm.setOptions({
      drawingControl: false,
      drawingMode: null 
    });

    marker.setDraggable(true);

    google.maps.event.addListener(marker, 'dragend', updateOptions);

    updateOptions();
    winResize();
    $options.show();
  }
})(DeviceCreate = {});

if (typeof Number.prototype.toRad == 'undefined') {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}


(function(exports) {
  var dc = exports;
  var $maptype, $options, $editor;
  var dm = null, marker = null, normalMode = true, infoWindow = null, infoWindowContent = null;

  dc.initialize = function() {
    $maptype = $("#editor-options .maptype");
    $options = $("#editor-options");
    $editor = $("#device-editor");
    $("#editor-options .maptype").click(changeMapType);
    $("#editor-options .continue").click(showEditor);
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

  function showEditor() {
    $options.hide();
    setNormalMode();

    marker.setDraggable(false);

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

    marker.setMap(null);
    dm.setOptions({ drawingControl: true });

    marker = null;
    $options.hide();

    setNormalMode();
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
      altitude: altitude
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

(function(exports) {
  var ac = exports;
  var $editor = null;
  var dm = null, overlayType = null, overlay = null, infoWindow = null, infoWindowContent = null;

  ac.initialize = function() {
    $editor = $("#area-editor");
    $(".btn-danger").live('click', cancelOverlay);
    $(".btn-primary").live('click', saveOverlay);

    var columbia = new google.maps.LatLng(40.809038567298586, -73.96126449108124);
    Map.objs.map.setCenter(columbia);

    dm = new google.maps.drawing.DrawingManager({
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          google.maps.drawing.OverlayType.CIRCLE,
          google.maps.drawing.OverlayType.POLYGON,
          google.maps.drawing.OverlayType.RECTANGLE
        ]
      }
    });

    google.maps.event.addListener(dm, 'overlaycomplete', doneDrawing);

    dm.setMap(Map.objs.map);
  }

  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function getCenter(o) {
    if(typeof o.getBounds !== "undefined")
      return o.getBounds().getCenter();

    var bounds = new google.maps.LatLngBounds();
    var points = o.getPath();
    
    points.forEach(function(p) {
      bounds.extend(p);
    });

    return bounds.getCenter();
  }

  function doneDrawing(event) {
    overlay = event.overlay;
    overlayType = event.type;

    dm.setOptions({
      drawingControl: false,
      drawingMode: null 
    });

    infoWindow = new google.maps.InfoWindow({
      content: $editor.clone().html(),
      position: getCenter(overlay) 
    });

    google.maps.event.addListener(infoWindow, 'closeclick', cancelOverlay);

    infoWindow.open(Map.objs.map);
  }

  function cancelOverlay() {
    infoWindow.close();

    overlay.setMap(null);
    dm.setOptions({ drawingControl: true });

    overlay = null;
    overlayType = null;
  }

  function saveOverlay(e) {
    var b = $(e.target);
    var form = b.parent();
    infoWindowContent = form.parent();
    var $error = form.find(".error");

    $error.hide();
    b.show();

    var name = form.find("#add-name").val()
    var url_name = form.find("#add-url-name").val()
    var altitude = form.find("#add-altitude").val()
    var parent_area = form.find("#add-parent").val()

    if (name == "" || url_name == "") {
      $error.text("Please enter a valid name and URL name.").show();
      return;
    } else if (!isNumeric(altitude)) {
      $error.text("Please enter a valid altitude.").show();
      return;
    }

    var area = {
        name: name,
        url_name: url_name,
        altitude: altitude,
        parent_area: parent_area,
        circle: (overlayType == "circle")
    }

    if(area.circle) {
        var c = overlay.getCenter();
        area.center = c.lng() + " " + c.lat();
        area.radius = overlay.radius;
    } else {
        var points = [];
        overlay.getPath().forEach(function(p) {
          points.push(p.lng() + " " + p.lat());
        });
        area.shape = points;
    }

    DeviceAPI.addArea(area, areaDone);
    b.hide();
  }

  function areaDone(data) {
    if(data.success) {
      infoWindowContent.children().hide();
      infoWindowContent.find(".success").show();
    } else {
      infoWindowContent.find(".editor-form .error").text("There was an error saving.").show();
      infoWindowContent.find(".editor-form .btn-primary").show();
    }
  }
})(AreaCreate = {});

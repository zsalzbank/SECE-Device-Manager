(function(exports) {
  var om = exports;
  var overlays = [];

  om.addOverlay = function(overlay) {
    var pA = new google.maps.LatLng(overlay.geoRefA_latitude, overlay.geoRefA_longitude);
    var pB = new google.maps.LatLng(overlay.geoRefB_latitude, overlay.geoRefB_longitude);

    var o = new RotatedOverlay(
      pA, pB,
      {x: overlay.imgRefAX, y: overlay.imgRefAY}, {x: overlay.imgRefBX, y: overlay.imgRefBY},
      DeviceAPI.getURL() + overlay.img,
      Map.objs.map
    );

    overlays.push(o);
  }

  om.loadOverlays = function() {
    DeviceAPI.getOverlays(function(data) {
      $.each(data, function(i, overlay) {
        om.addOverlay(overlay.overlay);
      });
    });
  }

  om.setOpacity = function(percent) {
    for(var o in overlays) {
        overlays[o].setOpacity(percent);
    }
  }
})(OverlayMap = {});

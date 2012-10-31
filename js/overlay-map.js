(function(exports) {
  var om = exports;

  om.addOverlay = function(overlay) {
    var pA = new google.maps.LatLng(overlay.geoRefA_latitude, overlay.geoRefA_longitude);
    var pB = new google.maps.LatLng(overlay.geoRefB_latitude, overlay.geoRefB_longitude);

    new RotatedOverlay(
      pA, pB,
      {x: overlay.imgRefAX, y: overlay.imgRefAY}, {x: overlay.imgRefBX, y: overlay.imgRefBY},
      DeviceAPI.getURL() + overlay.img,
      Map.objs.map
    );
  }

  om.loadOverlays = function() {
    DeviceAPI.getOverlays(function(data) {
      $.each(data, function(i, overlay) {
        om.addOverlay(overlay.overlay);
      });
    });
  }
})(OverlayMap = {});

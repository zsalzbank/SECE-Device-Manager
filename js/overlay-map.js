(function(exports) {
  var om = exports;
  var mapOverlays = {};
  var opacity = 50, altitude = -1;
  var extraGenerator = null, searchText = "";

  om.setExtra = function(e) {
    extraGenerator = e;
  }

  om.setAltitude = function(alt) {
    altitude = alt;
    update();
  }

  om.search = function(text) {
    searchText = text;
    update();
  }

  function update() {
    for (i in mapOverlays) {
      var visible = inSearchResults(mapOverlays[i].overlay);
      if(visible) {
        mapOverlays[i].ro.setMap(Map.objs.map);
        if(mapOverlays[i].extra != null) {
          mapOverlays[i].extra.show();
        }
      } else {
        om.removeOverlay(mapOverlays[i].overlay, false);
      }
    }
  }

  om.removeOverlay = function(overlay, deleteIt) {
    mapOverlays[overlay.id].ro.setMap(null);
    if(mapOverlays[overlay.id].extra != null) {
      mapOverlays[overlay.id].extra.hide();
    }

    if(deleteIt) {
      if(mapOverlays[overlay.id].extra != null) {
        mapOverlays[overlay.id].extra.remove();
      }
      
      delete mapOverlays[overlay.id];
    }
  }

  function inSearchResults(overlay) {
    if(altitude != -1 && (overlay.altitude > altitude + 5 || overlay.altitude < altitude - 5)) {
      return false;
    } else if(overlay.name.indexOf(searchText) == -1) {
      return false;
    }
    return true;
  }

  om.addOverlay = function(overlay) {
    var pA = new google.maps.LatLng(overlay.geoRefA_latitude, overlay.geoRefA_longitude);
    var pB = new google.maps.LatLng(overlay.geoRefB_latitude, overlay.geoRefB_longitude);

    var o = new RotatedOverlay(
      pA, pB,
      {x: overlay.imgRefAX, y: overlay.imgRefAY}, {x: overlay.imgRefBX, y: overlay.imgRefBY},
      DeviceAPI.getURL() + overlay.img,
      inSearchResults(overlay) ? Map.objs.map : null,
      opacity
    );

    var extra = (extraGenerator == null) ? null : extraGenerator(overlay);
    if(extra != null && !inSearchResults(overlay)) {
      extra.hide();
    }

    mapOverlays[overlay.id] = {
      overlay: overlay,
      ro: o,
      extra: extra
    };
  }

  om.drawOverlays = function(overlays) {
    $(overlays).each(function(i, overlay) {
      overlay = overlay.overlay;

      if(!(overlay.id in mapOverlays)) {
        om.addOverlay(overlay);
      }
    });
  }

  om.setOpacity = function(percent) {
    for(var o in mapOverlays) {
        if(inSearchResults(mapOverlays[o].overlay)) {
          mapOverlays[o].ro.setOpacity(percent);
        }
    }
    opacity = percent;
  }
})(OverlayMap = {});

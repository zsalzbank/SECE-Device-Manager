(function(exports) {
  var am = exports;
  var mapAreas = {};
  var visible = false;

  am.currentAreas = function() {
    return mapAreas;
  }

  am.clearAreas = function() {
    am.setMap(null);
    mapAreas = {};
  }

  am.setMap = function(map) {
    for(var opt in mapAreas) {
      mapAreas[opt].setMap(map);
    }
  }

  am.drawAreas = function(areas) {
    $(areas).each(function(i, area) {
      area = area.area;

      var pOverlay = null;
      if(area.circle) {
        pOverlay = new google.maps.Circle({
          center: new google.maps.LatLng(area.center_point.lat, area.center_point.lng),
          radius: area.radius,
          map: (visible) ? Map.objs.map : null
        });
      } else {
        var points = new google.maps.MVCArray();
        $(area.shape_points).each(function(i, pt) {
          points.push(new google.maps.LatLng(pt.lat, pt.lng)); 
        });
        pOverlay = new google.maps.Polygon({
          paths: points,
          map: (visible) ? Map.objs.map : null
        });
      }

      pOverlay.setOptions({
        clickable: false,
        fillColor: '#DDD',
        strokeColor: '#BBB'
      });
      mapAreas[area.id] = pOverlay;
    });
  }

  function setAreaMap(m) {
    for (i in mapAreas) {
      mapAreas[i].setMap(m);
    }
  }

  am.toggle = function(v) {
    if(typeof v === "undefined") v = !visible;

    if(v) {
      setAreaMap(Map.objs.map);
    } else {
      setAreaMap(null);
    }

    visible = v;
  }

})(AreaMap = {});

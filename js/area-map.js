(function(exports) {
  var am = exports;
  var mapAreas = {};

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
          map: Map.objs.map
        });
      } else {
        var points = new google.maps.MVCArray();
        $(area.shape_points).each(function(i, pt) {
          points.push(new google.maps.LatLng(pt.lat, pt.lng)); 
        });
        pOverlay = new google.maps.Polygon({
          paths: points,
          map: Map.objs.map
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

})(AreaMap = {});

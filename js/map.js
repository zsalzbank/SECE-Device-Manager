(function(exports) {
  var m = exports;
  var $canvas;
  var gcdr, map, pano, sv, dm = null;

  function resize() {
    $canvas.height($(document).height() - $canvas.offset().top);
    google.maps.event.trigger(map, "resize");
  }

  m.initializeMap = function(id) {
    $canvas = $(id);

    gcdr = new google.maps.Geocoder();  
    sv = new google.maps.StreetViewService();

    map = new google.maps.Map($canvas.get(0), {
      zoom: 11,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    pano = map.getStreetView();

    $(window).resize(resize);

    resize();

    m.objs = {
      gcdr: gcdr,
      map: map,
      pano: pano,
      sv: sv
    };

    map.setCenter(new google.maps.LatLng(40.809038567298586, -73.96126449108124));
  }

  m.setDrawingManager = function(drawingManager) {
    if(dm != null) {
      dm.setMap(null);
    }

    dm = drawingManager;

    if(dm != null) {
      dm.setMap(map);
    }
  }

})(Map = {});

(function(exports) {
  var dapi = exports;
  var host = location.hostname, port = 3000;
  var apiurl = "http://" + host + ":" + port + "/";

  dapi.getURL = function() {
    return apiurl;
  }

  dapi.getDevices = function(callback) {
    $.getJSON(apiurl + "devices.js?callback=?", callback); 
  }

  dapi.getNear = function(id, distance, callback) {
    $.getJSON(apiurl + "devices/" + id + "/near/?callback=?&distance=" + distance, callback, distance); 
  }

  dapi.getOverlays = function(callback) {
    $.getJSON(apiurl + "overlays.js?callback=?", callback); 
  }

  dapi.addDevice = function(name, lat, lng) {
    $.post(apiurl + "devices/", {
      device: {
        name: name,
        latitude: lat,
        longitude: lng
      }
    });
  }

  dapi.addOverlay = function(mA, mB, rA, rB, file, name, description, altitude) {
    var pA = mA.getPosition(), pB = mB.getPosition();

    var data = new FormData();
    data.append('overlay[name]', name);
    data.append('overlay[description]', description);
    data.append('overlay[img]', file);
    data.append('overlay[geoRefA]', "POINT(" + pA.lng() + " " + pA.lat() + ")");
    data.append('overlay[geoRefB]', "POINT(" + pB.lng() + " " + pB.lat() + ")");
    data.append('overlay[imgRefAX]', rA.x);
    data.append('overlay[imgRefAY]', rA.y);
    data.append('overlay[imgRefBX]', rB.x);
    data.append('overlay[imgRefBY]', rB.y);
    data.append('overlay[altitude]', altitude);

    $.ajax({ 
      url: apiurl + "overlays/",
      data: data,
      cache: false,
      contentType: false,
      processData: false,
      type: 'POST'
    });
  }

  dapi.deleteDevice = function(id, callback) {
    $.ajax(apiurl + "devices/" + id + "/", {
      type: "delete",
      complete: callback
    });
  }
})(DeviceAPI = {});

(function(exports) {
  var dapi = exports;
  var host = "localhost", port = 3000;
  var apiurl = "http://" + host + ":" + port + "/";

  dapi.getDevices = function(callback) {
    $.getJSON(apiurl + "devices.js?callback=?", callback); 
  }

  dapi.getNear = function(id, distance, callback) {
    $.getJSON(apiurl + "devices/" + id + "/near/?callback=?&distance=" + distance, callback, distance); 
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

  dapi.deleteDevice = function(id, callback) {
    $.ajax(apiurl + "devices/" + id + "/", {
      type: "delete",
      complete: callback
    });
  }


})(DeviceAPI = {});

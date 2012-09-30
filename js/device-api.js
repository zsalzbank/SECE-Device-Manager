(function(exports) {
  var dapi = exports;
  var host = "localhost", port = 3000;
  var apiurl = "http://" + host + ":" + port + "/";

  dapi.getDevices = function(callback) {
    $.getJSON(apiurl + "devices.js?callback=?", callback); 
  }

  dapi.deleteDevice = function(id) {
    console.log("Deleting " + id);
  }


})(DeviceAPI = {});

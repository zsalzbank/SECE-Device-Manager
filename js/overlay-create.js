(function(exports) {
  var oc = exports;
  var $instructions, $canvas, canvas, ctx;
  var mapEvent, markerA = null, markerB = null, refA = null, refB = null, img = null;
  
  function showStep(i) {
    $instructions.find(".step").hide();
    $($instructions.find(".step")[i]).show();
  }

  oc.initialize = function() {
    $instructions = $(".instructions");
    $canvas = $("#img-canvas");
    canvas = $canvas.get(0);
    ctx = canvas.getContext('2d');

    mapEvent = google.maps.event.addListener(Map.objs.map, "click", function(event) {
      markerA = new google.maps.Marker({
        position: event.latLng, 
        map: Map.objs.map,
        icon: 'http://www.google.com/mapfiles/markerA.png'
      });

      startMarkerB();
    });

    showStep(0);
  }

  function startMarkerB() {
    google.maps.event.removeListener(mapEvent);

    mapEvent = google.maps.event.addListener(Map.objs.map, "click", function(event) {
      markerB = new google.maps.Marker({
        position: event.latLng, 
        map: Map.objs.map,
        icon: 'http://www.google.com/mapfiles/markerB.png'
      });

      startImageSelection();
    });
  }

  function startImageSelection() {
    google.maps.event.removeListener(mapEvent);
    showStep(1);

    $("#img-loader").change(handleImage);
  }

  function handleImage(e){
    var reader = new FileReader();

    reader.onload = function(event){
      img = new Image();
      img.onload = function(){
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img,0,0);
      }
      img.src = event.target.result;

      startReferenceSelection();
    };
    reader.readAsDataURL(e.target.files[0]);     
  }

  function drawPoint(text, that, e) {
    var mouseX = e.pageX - that.offsetLeft;
    var mouseY = e.pageY - that.offsetTop;

    ctx.fontStyle = "20pt sans-serif";
    ctx.fillStyle = "rgba(0, 0, 0, 1)"    
    ctx.fillText(text, mouseX + 10, mouseY);

    ctx.fillStyle = "rgba(255, 0, 0, .5)"    
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 5, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();


    return { x: mouseX, y: mouseY };
  }

  function startReferenceSelection() {
    showStep(2);

    $canvas.click(function(e) {
      refA = drawPoint('A', this, e);

      startRefB();
    });
  }

  function startRefB() {
    $canvas.unbind().click(function(e) {
      refB = drawPoint('B', this, e);

      $canvas.unbind();

      var x = new RotatedOverlay(
        markerA.getPosition(), markerB.getPosition(),
        refA, refB,
        img.src,
        Map.objs.map
      );
    });
  }
})(OverlayCreate = {});

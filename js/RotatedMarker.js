RotatedMarker.prototype = new google.maps.OverlayView();

function RotatedMarker(loc, rotation, map) {
  this.loc_ = loc;
  this.rotation_ = rotation;
  this.clickevent_ = null;
  this.clickhandler_ = null;

  this.div_ = null;

  this.setMap(map);
}

RotatedMarker.prototype.onAdd = function() {
  var div = $('<div></div>').css({position: 'absolute'});
  div.css({
    '-webkit-transform-origin': '8.5px 9px',
    width: '17px',
    height: '18px',
    'background-image': 'url(img/arrow.png)'
  });

  var panes = this.getPanes();
  panes.overlayImage.appendChild(div.get(0));

  this.div_ = div;

  var that = this;
  this.clickevent_ = google.maps.event.addDomListener(this.div_.get(0), 'click', function() {
    if(that.clickhandler_ != null) {
      that.clickhandler_();
    }
  });
}

RotatedMarker.prototype.draw = function() {
  var projection = this.getProjection();
  var pos = projection.fromLatLngToDivPixel(this.loc_);

  this.div_.css('left', (pos.x-8.5) + 'px');
  this.div_.css('top', (pos.y-9) + 'px');
  this.div_.css('-webkit-transform', 'rotate(' + (this.rotation_ + 180) + 'deg)');

  if(this.clickhandler_ != null) {
    this.div_.css('cursor', 'pointer');
  }
}

RotatedMarker.prototype.setClick = function(handler) {
  this.clickhandler_ = handler;
}

RotatedMarker.prototype.setRotation = function(deg) {
  this.rotation_ = deg;
  this.div_.css('-webkit-transform', 'rotate(' + (this.rotation_ + 180) + 'deg)');
}

RotatedMarker.prototype.getRotation = function() {
  return this.rotation_;
}

RotatedMarker.prototype.getPosition = function() {
  return this.loc_;
}

RotatedMarker.prototype.onRemove = function() {
  google.maps.event.removeListener(this.clickevent_);
  this.clickevent_ = null;

  this.div_.remove();
  this.div_ = null;
}

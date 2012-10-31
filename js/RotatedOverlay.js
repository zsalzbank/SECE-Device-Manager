RotatedOverlay.prototype = new google.maps.OverlayView();

function RotatedOverlay(locA, locB, refA, refB, image, map) {
  this.locA_ = locA;
  this.locB_ = locB;
  this.refA_ = refA;
  this.refB_ = refB;

  this.image_ = new Image;
  this.image_.src = image;

  this.refAngle_ = Math.atan((refB.y - refA.y)/(refB.x - refA.x)) * 180/Math.PI;
  this.refDistance_ = Math.sqrt(Math.pow(refB.x - refA.x, 2) + Math.pow(refB.y - refA.y, 2)); 

  this.div_ = null;
  this.div_img_ = null;

  this.setMap(map);
}

RotatedOverlay.prototype.onAdd = function() {
  var div = $('<div></div>').css({position: 'absolute'});

  var img = $('<img/>');
  img.attr('src', this.image_.src);

  $(div).append(img);

  var panes = this.getPanes();
  panes.overlayLayer.appendChild(div.get(0));

  this.div_ = div;
  this.div_img_ = img;
}

RotatedOverlay.prototype.draw = function() {
  var projection = this.getProjection();

  var posA = projection.fromLatLngToDivPixel(this.locA_),
      posB = projection.fromLatLngToDivPixel(this.locB_);

  var rotAngle = Math.atan((posB.y - posA.y)/(posB.x - posA.x)) * 180/Math.PI - this.refAngle_;
  if(this.refA_.x > this.refB_.x || posA.x > posB.x) {
    rotAngle += 180;
  }

  var distance = Math.sqrt(Math.pow(posB.x - posA.x, 2) + Math.pow(posB.y - posA.y, 2));
  var scale = distance/this.refDistance_ ;

  this.div_img_.css('width', scale * this.image_.width + 'px');
  this.div_img_.css('height', scale * this.image_.height + 'px');
  this.div_.css('left', posA.x - scale*this.refA_.x + 'px');
  this.div_.css('top', posA.y - scale*this.refA_.y + 'px');
  this.div_.css('-webkit-transform-origin', scale*this.refA_.x + 'px ' + scale*this.refA_.y + 'px');
  this.div_.css('-webkit-transform', 'rotate(' + rotAngle + 'deg)');
}

RotatedOverlay.prototype.setOpacity = function(percent) {
  this.div_.css('opacity', percent/100);
}

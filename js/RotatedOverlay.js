RotatedOverlay.prototype = new google.maps.OverlayView();

function RotatedOverlay(locA, locB, refA, refB, image, map) {
  this.locA_ = locA;
  this.locB_ = locB;
  this.refA_ = refA;
  this.refB_ = refB;

  var that = this;
  this.image_ = new Image;
  $(this.image_).load(function() {
    that.origWidth_ = this.width;
    that.origHeight_ = this.height;
    that.canvasSize_ = Math.max(this.width, this.height) * 3;
  });
  this.image_.crossOrigin = '';
  this.image_.src = image;

  this.refAngle_ = Math.atan((refB.y - refA.y)/(refB.x - refA.x)) * 180/Math.PI;
  this.refDistance_ = Math.sqrt(Math.pow(refB.x - refA.x, 2) + Math.pow(refB.y - refA.y, 2)); 

  this.canvas_ = null;
  this.ctx_ = null;
  this.div_ = null;
  this.div_img_ = null;

  this.map_ = map;
  this.setMap(map);
}

RotatedOverlay.prototype.onAdd = function() {
  var div = $('<div></div>').css({position: 'absolute'});
  var img = $('<img/>');

  $(div).append(img);

  var canvas = $('<canvas></canvas>');

  var panes = this.getPanes();
  panes.overlayLayer.appendChild(div.get(0));

  this.div_ = div;
  this.div_img_ = img;
  this.canvas_ = canvas.get(0);;
  this.ctx_ = this.canvas_.getContext('2d');
}

RotatedOverlay.prototype.draw = function() {
  var canvas = this.canvas_, ctx = this.ctx_;
  var projection = this.getProjection();

  var posA = projection.fromLatLngToDivPixel(this.locA_),
      posB = projection.fromLatLngToDivPixel(this.locB_);
  var rotAngle = Math.atan((posB.y - posA.y)/(posB.x - posA.x)) * 180/Math.PI - this.refAngle_;
  if(this.refA_.x > this.refB_.x) rotAngle += 180;
  if(posA.x > posB.x) rotAngle += 180;

  var distance = Math.sqrt(Math.pow(posB.x - posA.x, 2) + Math.pow(posB.y - posA.y, 2));
  var scale = distance/this.refDistance_ ;

  canvas.width = this.canvasSize_;
  canvas.height = this.canvasSize_; 

  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.translate(this.canvasSize_/2, this.canvasSize_/2);
  ctx.rotate(rotAngle * Math.PI/180);
  ctx.drawImage(this.image_, -this.origWidth_/2, -this.origHeight_/2);
  ctx.restore();

  var ra = -rotAngle * Math.PI/180;
  var np = { x: (this.canvasSize_ - this.origWidth_)/2 + this.refA_.x, y: (this.canvasSize_ - this.origHeight_)/2 + this.refA_.y };
  var cp = { x: np.x - this.canvasSize_/2, y: this.canvasSize_/2 - np.y }; 
  var rot = { x: cp.x*Math.cos(ra) - cp.y * Math.sin(ra), y: cp.x*Math.sin(ra) + cp.y*Math.cos(ra) };
  var pt = { x: rot.x + this.canvasSize_/2, y: this.canvasSize_/2 - rot.y };

  var bounds = this.getBounds(ctx.getImageData(0, 0, canvas.width, canvas.height), canvas.width, canvas.height);
  data = ctx.getImageData(bounds.tl.x, bounds.tl.y, bounds.br.x - bounds.tl.x, bounds.br.y - bounds.tl.y);

  var fp = { x: pt.x-bounds.tl.x, y: pt.y-bounds.tl.y};

  canvas.width = bounds.br.x - bounds.tl.x;
  canvas.height = bounds.br.y - bounds.tl.y;
  ctx.putImageData(data, 0, 0);

  this.div_img_.attr('src', canvas.toDataURL());
  this.div_img_.css('width', scale * canvas.width + 'px');
  this.div_img_.css('height', scale * canvas.height + 'px');
  this.div_.css('left', posA.x - fp.x*scale + 'px');
  this.div_.css('top', posA.y - fp.y*scale + 'px');
}

RotatedOverlay.prototype.getBounds = function(imageData, ww, wh) {
  var topLeftCorner = {};
  topLeftCorner.x = 9999;
  topLeftCorner.y = 9999;

  var bottomRightCorner = {};
  bottomRightCorner.x = -1;
  bottomRightCorner.y = -1;                             

  for (y = 0; y < wh; y++) {
    for (x = 0; x < ww; x++) {
      var pixelPosition = (x * 4) + (y * wh * 4);
      a = imageData.data[pixelPosition+3];
      if (a > 0) {
        if (x < topLeftCorner.x) {
          topLeftCorner.x = x;
        }
        if (y < topLeftCorner.y) {
          topLeftCorner.y = y;
        }
        if (x > bottomRightCorner.x) {
          bottomRightCorner.x = x;
        }
        if (y > bottomRightCorner.y) {
          bottomRightCorner.y = y;
        }
      }
    }
  }

  return { tl: topLeftCorner, br: bottomRightCorner };
}

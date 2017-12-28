var MapWrapper = require('./models/mapWrapper');

var createMap = function(){
  var container = document.getElementById('map-container');
  var center = { lat: 56.740674, lng: -4.2187500 };
  var zoom = 7;
  var map = new MapWrapper(container, center, zoom);
  map.userLocation();
}

var app = function(){
  console.log('app running');
  createMap();
};

window.addEventListener('load', app);

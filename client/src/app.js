var MapWrapper = require('./models/mapWrapper');

var createMap = function(){
  var container = document.getElementById('map-container');
  var center = { lat: 56.740674, lng: -4.2187500 };
  var zoom = 7;
  var map = new MapWrapper(container, center, zoom);
  map.userLocation();
  createMapSearchBoxInput(map);
}

var createMapSearchBoxInput = function(map){
  var input = document.createElement("input");
  input.id = "search-input";
  input.class = "controls";
  input.type = "text";
  input.placeholder = "Search for a location";
  map.createSearchBox(input);
}

var app = function(){
  console.log('app running');
  createMap();
};

window.addEventListener('load', app);

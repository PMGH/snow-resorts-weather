var makeRequest = function(url, callback){
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.addEventListener('load', callback);
  request.send();
};

var skiMapRequestComplete = function(){
  if (this.status != 200){ return console.log('request failed') }
  console.log('request successful');
  var jsonString = this.responseText;
  var apiData = JSON.parse(jsonString);
  console.log(apiData);
  populateRegionList(apiData);
};

var getRegions = function(apiData){
  var regions = [];
  for(var resort of apiData){
    var region = resort.Region[0];
    if (region != undefined){
      if (!regions.includes(region.name)){ regions.push(region.name); }
    };
  };
  regions.sort();
  return regions;
};

var populateRegionList = function(apiData){
  var listHeader = document.getElementById('list-header');
  var list = document.getElementById('list-container');
  var regions = getRegions(apiData);
  console.log(regions);
  listHeader.innerText = 'Regions';
  for (var region of regions){
    createListItem(region, list, region, 'region-list-item');
  };
};

var populateResortList = function(region){
};

var createListItem = function(name, parent, id, className){
  var item = createElement('div');
  if (id !== undefined){ item.id = id; }
  item.className = className;
  item.innerText = name;
  addListener(item, name, className);
  parent.appendChild(item);
};

var addListener = function(item, name, className){
  if (className === 'region-list-item'){
    item.addEventListener('click', function(){
      console.log('region clicked');
      populateResortList(name);
    });
  };
  if (className === 'resort-list-item'){
    item.addEventListener('click', function(){
      console.log('resort clicked');
      // request weather (callback: display weather)
      // expand div and show additional resort details
      // display link to most recent piste map
    });
  };
};

var createElement = function(element){
  var newElement = document.createElement(element);
  return newElement;
};

var createMap = function(){
  var MapWrapper = require('./models/mapWrapper');
  var container = document.getElementById('map-container');
  var center = { lat: 56.740674, lng: -4.2187500 };
  var zoom = 7;
  var map = new MapWrapper(container, center, zoom);
  map.userLocation();
  createMapSearchBoxInput(map);
};

var createMapSearchBoxInput = function(map){
  var input = document.createElement('input');
  input.id = 'search-input';
  input.class = 'controls';
  input.type = 'text';
  input.placeholder = 'Search for a location';
  map.createSearchBox(input);
};

var removeChildNodes = function(node){
  while (node.hasChildNodes()) {
    node.removeChild(node.lastChild);
  };
};

var app = function(){
  console.log('app running');
  var url = "https://skimap.org/SkiAreas/index.json";
  makeRequest(url, skiMapRequestComplete);
  createMap();
};

window.addEventListener('load', app);

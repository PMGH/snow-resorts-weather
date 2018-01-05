var makeRequest = function(url, callback){
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.addEventListener('load', callback);
  request.send();
};

var dbRequestComplete = function(){
  if (this.status !== 200){ return console.log('DB request failed') }
  console.log('DB request successful');
  var jsonString = this.responseText;
  var apiData = JSON.parse(jsonString);
  console.log(apiData);
  plotResortMarkers(apiData);
  populateRegionList(apiData);
};

var plotResortMarkers = function(apiData){
  apiData.forEach(function(area){
    var region = (area.Region[0] !== undefined) ? area.Region[0].name : "No region data";
    var skiArea = {
      region: region,
      name: area.SkiArea.name,
      location: {
        lat: parseFloat(area.SkiArea.geo_lat),
        lng: parseFloat(area.SkiArea.geo_lng)
      }
    }
    map.addMarker(skiArea);
  });
};

var populateRegionList = function(apiData){
  clearListSection();
  createListHeaderText('Regions');
  var list = document.getElementById('list-container');
  var regions = getRegions(apiData);
  for (var region of regions){
    createListItem(region, list, region, 'region-list-item', apiData);
  };
  scrollToListTop();
};

var getRegions = function(apiData){
  var regions = [];
  for(var resort of apiData){
    var region = resort.Region[0];
    if (region !== undefined){
      if (!regions.includes(region.name)){ regions.push(region.name); }
    };
  };
  regions.sort();
  return regions;
};

var populateResortList = function(apiData, resortsByRegion){
  clearListSection();
  createListBackButton(apiData);
  createListHeaderText('Resorts');
  var list = document.getElementById('list-container');
  for (var resort of resortsByRegion){
    if ((resort.geo_lat != null) && (resort.geo_lng != null)){
      createListItem(resort.name, list, resort.name, 'resort-list-item', resortsByRegion, resort);
    }
  };
  scrollToListTop();
};

var clearListSection = function(){
  var listHeader = document.getElementById('list-header');
  var list = document.getElementById('list-container');
  removeChildNodes(listHeader);
  removeChildNodes(list);
};

var createListBackButton = function(apiData){
  var listHeader = document.getElementById('list-header');
  var backButton = createElement('div', 'resorts-back-button');
  backButton.innerText = '<';
  backButton.addEventListener('click', function(){ populateRegionList(apiData); });
  listHeader.appendChild(backButton);
};

var createListHeaderText = function(name){
  var listHeader = document.getElementById('list-header');
  var listHeaderText = createElement('div', 'list-header-text');
  listHeaderText.innerText = name;
  listHeader.appendChild(listHeaderText);
};

var createListItem = function(heading, parent, id, className, apiData, resort){
  var item = createElement('div', id, className);
  var itemHeading = createElement('div', id + '-heading', className + '-heading');
  itemHeading.innerText = heading;
  item.appendChild(itemHeading);
  addListener(item, heading, className, apiData, resort);
  parent.appendChild(item);
};

var addListener = function(item, name, className, apiData, resort){
  if (className === 'region-list-item'){ addRegionListener(item, name, apiData); };
  if (className === 'resort-list-item'){ addResortListener(item, name, resort); };
};

var addRegionListener = function(item, name, apiData){
  item.addEventListener('click', function(){
    console.log('Region clicked');
    var resortsByRegion = trimDataSet(apiData, name);
    populateResortList(apiData, resortsByRegion);
  });
};

var trimDataSet = function(apiData, region){
  var trimmedDataSet = [];
  for(var resort of apiData){
    if ((resort.Region[0] !== undefined) && (resort.Region[0].name === region)){ trimmedDataSet.push(resort.SkiArea); }
  };
  trimmedDataSet.sort(compareValues('name', 'asc'));
  return trimmedDataSet;
};

var compareValues = function (key, order='asc') {
  return function(a, b) {
    if(!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) { return 0; }
    const varA = (typeof a[key] === 'string') ? a[key].toUpperCase() : a[key];
    const varB = (typeof b[key] === 'string') ? b[key].toUpperCase() : b[key];
    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    };
    return ((order == 'desc') ? (comparison * -1) : comparison );
  };
};

var collapsedContainers = [];
var expandedContainers = [];
var addResortListener = function(item, name, resort){
  var clicks = 0;
  item.addEventListener('click', function(){
    console.log('Resort clicked');
    if (clicks < 1){
      clicks += 1;
      var url = generateWeatherRequestURL(resort);
      makeWeatherRequest(url, function(){ weatherRequestComplete.call(this, resort); });
      map.recenter({ lat: parseFloat(resort.geo_lat), lng: parseFloat(resort.geo_lng) });
      // TODO: display link to most recent piste map
    }
  });
};

// TODO: add expand/collapse functionality to resort list items
var closeWeatherContainers = function(){
  var listContainer = document.getElementById('list-container');
  for (var listItem of listContainer.children){
    console.log('listItem: ', listItem);
    listItem.children[1].style.display = 'none';
  }
}

var generateWeatherRequestURL = function(resort){
  var name = resort.name;
  var lat = resort.geo_lat;
  var lng = resort.geo_lng;
  var reportDays = 2;
  var url = `https://api.worldweatheronline.com/premium/v1/ski.ashx?key=ebbbfe3e5f59416284e222010170812&q=${lat},${lng}&num_of_days=${reportDays}&includeLocation=no&format=json`;
  console.log(url);
  return url;
};

var makeWeatherRequest = function(url, callback){
  var request = new XMLHttpRequest();
  request.open('GET', url);
  request.addEventListener('load', callback);
  request.send();
};

var weatherRequestComplete = function(resort){
  if (this.status !== 200){ return console.log('Weather request failed, this.status: ', this.status); }
  console.log('Weather request successful');
  var jsonString = this.responseText;
  var apiData = JSON.parse(jsonString);
  var weather = apiData.data.weather;
  console.log('weather: ', weather);
  appendWeatherToListItem(resort, weather);
};

var appendWeatherToListItem = function(resort, weather){
  var listItem = document.getElementById(resort.name);
  var weatherContainer = createElement('div', resort.name + '-weather', 'list-item-weather-container');
  for (var report of weather){
    var reportContainer = createElement('div', resort.name + '-weather-' + report.date, 'list-item-weather-report');
    var date = createElement('h4', undefined, 'list-item-weather-date');
    var chanceOfSnow = createElement('h5', undefined, 'list-item-weather-chance-of-snow');
    date.innerText = report.date;
    chanceOfSnow.innerText = `Chance of snow: ${report.chanceofsnow}%`;
    reportContainer.appendChild(date);
    reportContainer.appendChild(chanceOfSnow);
    weatherContainer.appendChild(reportContainer);
  }
  listItem.appendChild(weatherContainer);
};

var createElement = function(element, id, className){
  var newElement = document.createElement(element);
  if (id !== undefined){ newElement.id = id; }
  if (className !== undefined){ newElement.className = className; }
  return newElement;
};

var createMap = function(){
  var MapWrapper = require('./models/mapWrapper');
  var container = document.getElementById('map-container');
  var center = { lat: 56.740674, lng: -4.2187500 };
  var zoom = 7;
  map = new MapWrapper(container, center, zoom);
  map.userLocation();
  createMapSearchBoxInput(map);
};

var createMapSearchBoxInput = function(map){
  var input = createElement('input', 'search-input', 'controls');
  input.type = 'text';
  input.placeholder = 'Search for a location';
  map.createSearchBox(input);
};

var scrollToListTop = function(){
  var list = document.getElementById('list-container');
  list.scrollTo(0, 0);
};

var removeChildNodes = function(node){
  while (node.hasChildNodes()) { node.removeChild(node.lastChild); };
};

var app = function(){
  console.log('APP RUNNING');
  var url = "http://localhost:3000/resorts";
  makeRequest(url, dbRequestComplete);
  createMap();
};

window.addEventListener('load', app);

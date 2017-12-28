var MapWrapper = function(container, coords, zoom){
  this.googleMap = new google.maps.Map(container, {
    center: coords,
    zoom: zoom
  });
  this.markers = [];
  this.newMarkers = [];
};

MapWrapper.prototype.userLocation = function(){
  navigator.geolocation.getCurrentPosition(function(position){
    var coords = {lat: position.coords.latitude, lng: position.coords.longitude};
    this.googleMap.setCenter(coords);
    this.googleMap.setZoom(12);
  }.bind(this));
};

MapWrapper.prototype.createSearchBox = function(input){
  var searchBox = new google.maps.places.SearchBox(input);
  this.googleMap.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  // event listener for place selection
  searchBox.addListener("places_changed", function() {
    this.removeUserMarker();
    var places = searchBox.getPlaces();
    if (places.length == 0) {
      return;
    };
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var newPlace = place;
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      };
      // Create a marker for each place.
      var icon = {
        url: "/icons/user-location.png",
      };
      this.createMarker(newPlace, icon, this.newMarkers);
      var contentString = '<div id="content">' +
      '<div id="bodyContent">' +
      `<h3 id="user-loc">You are here</h3>` +
      '</div>' +
      '</div>';
      var marker = this.newMarkers[0];
      marker.infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      marker.infowindow.open(this.googleMap, marker);
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      };
    }.bind(this));
    this.googleMap.fitBounds(bounds);
  }.bind(this));
};

MapWrapper.prototype.createMarker = function(place, icon, array){
  var newMarker = new google.maps.Marker({
    map: this.googleMap,
    icon: icon,
    title: place.name,
    position: place.geometry.location
  });
  array.push(newMarker);
};

MapWrapper.prototype.removeUserMarker = function(){
  if(this.newMarkers.length >= 1){
    var last = this.newMarkers.pop();
    last.setMap(null);
  }else{
    console.log("nothing to remove");
  };
};

module.exports = MapWrapper;

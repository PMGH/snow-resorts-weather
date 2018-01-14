# Snow Resorts Weather    

![Image](/screenshots/gsaw.png)   
![Image](/screenshots/gsaw_regions.png)   
![Image](/screenshots/gsaw_ski_areas.png)   
![Image](/screenshots/gsaw_ski_areas_weather.png)   

## Project Specification    
Personally defined.

Build an application to obtain and display ski area data and associated weather information such as 'chance of snow' and 'temperatures'.  

## Project    
This was a solo personal project creating in my spare time over the Christmas break (Dec 2017) utilising a local version of the SkiMap API, Google Maps API and World Weather Online API.

I am a keen snowboarder that tries to get away to the mountains at least once per year and decided to create something that would provide weather details for ski areas around the world in order to improve my JavaScript skills.

The application was built with Vanilla JavaScript and makes use of AJAX requests (XMLHttpRequests) to various APIs. It is composed of a Google Map that geolocates the user (if permitted - in order to view nearby ski areas) alongside a list view that is populated with regions and ski areas.

When a region is selected the list repopulates with the associated ski areas for the selected region.

When a ski area is selected an asynchronous request is sent to the World Weather Online API for a 3 day weather report for the selected ski area (based on latitude and longitude). When the response is received the application adds the weather report to the associated list item.

## Built With    
* Vanilla JavaScript (http://vanilla-js.com/) :)  
* HTML5 (https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)  
* CSS3 (https://developer.mozilla.org/en-US/docs/Web/CSS/CSS3)  
* JSON (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON)  
* SkiMap API (https://skimap.org/pages/Developers)  
* Google Maps API (https://developers.google.com/maps/documentation/javascript/)  
* Google Maps Places (https://developers.google.com/places/javascript/)  
* Google Maps Geolocation (https://developers.google.com/maps/documentation/javascript/geolocation)  
* World Weather Online API (https://developer.worldweatheronline.com/api/)  

## Authors    
* Peter McCready

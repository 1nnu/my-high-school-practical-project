let map, infoWindow, marker, bounds, currentInfoWindow, markerNEW, markerPos, randomPlace;
    let posit;
    let temp;
    var directionsDisplay;
    var x, link = "https://www.google.com/maps/place/"
    const placeCategory = ["park", "restoran", "mäng", "muuseum", "kaubamaja", "tervis"];
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        posit = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        document.getElementById('latitude').textContent = posit.lat;
        document.getElementById("longitude").textContent = posit.lng;
      });
    }



    function initMap() {
      bounds = new google.maps.LatLngBounds();
      infoWindow = new google.maps.InfoWindow;
      currentInfoWindow = infoWindow;
      infoPane = document.getElementById('panel');
      map = new google.maps.Map(document.getElementById("map"), {
        center: posit,
        zoom: 13,
      });

      bounds.extend(posit);

      infoWindow.setPosition(posit);
      infoWindow.setContent('Location found.');
      infoWindow.open(map);
      map.setCenter(posit);


      getNearbyPlaces(posit);

      marker = new google.maps.Marker({
        map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: posit,
        label: "Teie asukoht"
      });
    }

    function getNearbyPlaces(position) {
      let temp = Math.round(random(0, 5));
      let request = {
        location: position,
        rankBy: google.maps.places.RankBy.DISTANCE,
        keyword: placeCategory[temp]
      };

      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, nearbyCallback);
    }


    function nearbyCallback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        createMarkers(results);
      }
    }

    function createMarkers(places) {
      let temp = Math.round(random(0, 19));
      randomPlace = places[temp];
      displayInfo(randomPlace);
      markerNEW = new google.maps.Marker({
        position: randomPlace.geometry.location,
        map: map,
        title: randomPlace.name
      });
      document.getElementById("demo").innerHTML = markerNEW.title;

      google.maps.event.addListener(markerNEW, 'click', () => {
        let request = {
          placeId: randomPlace.place_id,
          fields: ['name', 'formatted_address', 'geometry', 'rating',
            'website', 'photos']
        };
      });
      calcRoute();
    }
    function calcRoute() {
      var start = posit;
      var end = markerNEW.position;
      var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
      };
      directionsDisplay = new google.maps.DirectionsRenderer();
      var directionsService = new google.maps.DirectionsService();
      directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          directionsDisplay.setMap(map);
        }
      });
    }
    function displayInfo(randomPlace) {
      const request = {
        placeId: randomPlace.place_id,
        fields: ["name", "formatted_address", "place_id", "rating", "photos","website"]
      };
      service.getDetails(request, (place, status) => {
        document.getElementById("demo2").innerHTML = place.rating;
        document.getElementById("demo3").innerHTML = place.formatted_address;
        document.getElementById("demo4").innerHTML = place.website;
        var linkgooglemaps = link.concat(place.formatted_address);
        const b = document.querySelector('#demo4');
        b.href = place.website;
        const a = document.querySelector("#link");
        a.href = linkgooglemaps;
      });
    }



    function random(min, max) {
      return Math.random() * (max - min) + min;
    }
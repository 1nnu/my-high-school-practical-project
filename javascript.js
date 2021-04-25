let map, infoWindow, marker, bounds, currentInfoWindow, markerNEW, markerPos, randomPlace, posit, temp, request;
    var directionsDisplay, userSearch = false;                                                                          //Erinevate tegurite deklareerimine
    var link = "https://www.google.com/maps/place/"
    const placeCategory = ["park", "restoran", "mäng", "muuseum", "kaubamaja", "tervis"];                                                                        //Funktsioon, mis küsib kasutajalt asukoha ning salvestab selle
      navigator.geolocation.getCurrentPosition(position => {
        posit = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        document.getElementById('latitude').textContent = posit.lat;
        document.getElementById("longitude").textContent = posit.lng;
      });

    function initMap() {                                                                                //Peamine kaardi funktsioon, mis tekitab veebilehele kaardi vastavate parameetritega
      bounds = new google.maps.LatLngBounds();
      infoWindow = new google.maps.InfoWindow;
      currentInfoWindow = infoWindow;
      infoPane = document.getElementById('panel');
      map = new google.maps.Map(document.getElementById("map"), {
        center: posit,
        zoom: 13,
      });

      bounds.extend(posit);

      infoWindow.setPosition(posit);                        //Kasutaja asukoha märgistav funktsioon
      infoWindow.setContent('Asute siin.');
      infoWindow.open(map);
      map.setCenter(posit);

      getNearbyPlaces(posit);                               //Kutsub funktsiooni, mis otsib kasutaja läheduses olevaid huvipunkte

      marker = new google.maps.Marker({
        map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: posit,
        label: "Teie asukoht"
      });
    }

    function getNearbyPlaces(position) {     
      let requestUser = document.getElementById("otsing").value;                                                           //Funktsioon, mis annab asukohtade otsingule parameetrid
      let temp = Math.round(random(0, 5));
      if (requestUser.length > 1) {
        request = {
          location: position,
          rankBy: google.maps.places.RankBy.DISTANCE,
          keyword: requestUser
        };
        userSearch = true;
      }
        else{
      
       request = {
        location: position,
        rankBy: google.maps.places.RankBy.DISTANCE,
        keyword: placeCategory[temp]
      };
    }
      service = new google.maps.places.PlacesService(map);
      service.nearbySearch(request, nearbyCallback);                                                    //Funktsioon, mis kasutab parameetrite objekti otsinguks ning saab vastuseks 20 objektise massiivi
    }


    function nearbyCallback(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {                                        
        createMarkers(results);
      }
    }

    function createMarkers(places) {                                                                    //Valib ühe kahekümnest erinevast asukohast ühe ning tekitab sellele kohale kaardil märgise
      let temp = Math.round(random(0, (places.length - 1)));
      randomPlace = places[temp];
      displayInfo(randomPlace);
      markerNEW = new google.maps.Marker({
        position: randomPlace.geometry.location,
        map: map,
        title: randomPlace.name
      });
      document.getElementById("title").innerHTML = markerNEW.title;

      google.maps.event.addListener(markerNEW, 'click', () => {                                        //Vajutades märgisele saab asukoha kohta infot(pole eriti vajalik, kuna veebileht näitab inforibal seda)
        let request = {
          placeId: randomPlace.place_id,
          fields: ['name', 'formatted_address', 'geometry', 'rating',
            'website', 'photos']
        };
      });
      calcRoute();
    }
    function calcRoute() {                                                                            // Asukohtade vahelise teekonna märgistaja, et tekitada visuaalset arusaama kasutaja ning huvipunkti distantsil.
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
    function displayInfo(randomPlace) {                                                             //Inforiba täiendaja, mis kutsub asukoha info saamiseks "getDetails" funktsiooni
      const request = {
        placeId: randomPlace.place_id,
        fields: ["name", "formatted_address", "place_id", "rating", "photos","website"]
      };
      service.getDetails(request, (place, status) => {
        document.getElementById("rating").innerHTML = place.rating;
        if (typeof place.rating == 'undefined') {
          document.getElementById("rating").innerHTML = "Reiting pole saadaval";
        }
        document.getElementById("address").innerHTML = place.formatted_address;
        if (typeof place.formatted_address == 'undefined') {
          document.getElementById("address").innerHTML = "Aadress pole saadaval";
        }
        
        document.getElementById("website").innerHTML = (place.website.slice(0,30)) + "...";       //Asukoha veebilehe aadressi lühendaja
        if (typeof place.website == 'undefined') {
          document.getElementById("website").innerHTML = "Veebileht pole saadaval";
        }
        var linkgooglemaps = link.concat(place.formatted_address);
        const b = document.querySelector('#website');
        b.href = place.website;
        const a = document.querySelector("#link");
        a.href = linkgooglemaps;
      });

    }



    function random(min, max) {                     //Suvalise numbri tekitaja
      return Math.floor( Math.random() * (max-min+1) ) + min;
    }
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
var directionsDisplay;
var directionService;
var googleMapInit = false;
var a_from;
var a_to;
var map;
function initMap() {
    directionService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    googleMapInit= true;
     map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 45.51289075295955, lng: -73.67206007100614 },
        zoom: 13,
        mapTypeControl: false,
    });
    const input = document.getElementById("departureAddr");
    const inputTo = document.getElementById("destinationAddr");
    const options = {
        fields: ["formatted_address", "geometry", "name","address_components"],
        strictBounds: false,
    };

    if(input) {
        var autocomplete = new google.maps.places.Autocomplete(input, options);
        autocomplete.bindTo("bounds", map);

    }
    if(inputTo) {
        var autocomplete2 = new google.maps.places.Autocomplete(inputTo, options);
        autocomplete2.bindTo("bounds", map);

    }
    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.



    const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
    });
    if(input) {
        autocomplete.addListener("place_changed", () => {
            marker.setVisible(false);
            let address1 = "";
            let postcode = "";
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                showTempPopup({
                    titleContent: '<p>Notification</p>',
                    bodyContent: "No details available for input: '" + place.name + "'",
                    popupSize: 'medium',
                })
                return;
            }
            let placeCoordinaes = {
                "lat": place.geometry.location.lat(),
                "lng": place.geometry.location.lng()
            }
            if (arePointsNear(placeCoordinaes, monrealCenterCoodrinates, serviceRadiusKm)) {
                console.log("in")
            } else {
                console.log("out")

            }
            for (const component of place.address_components) {
                // @ts-ignore remove once typings fixed
                const componentType = component.types[0];

                switch (componentType) {
                    case "street_number": {
                        address1 = `${component.long_name} ${address1}`;
                        break;
                    }

                    case "route": {
                        address1 += component.short_name;
                        break;
                    }

                    case "postal_code": {
                        postcode = `${component.long_name}${postcode}`;
                        break;
                    }

                    case "postal_code_suffix": {
                        postcode = `${postcode}-${component.long_name}`;
                        break;
                    }
                }
            }
            document.getElementById("postalFrom").value = postcode
            document.getElementById("postalFrom").parentNode.classList.remove("error");


            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                map.fitBounds(place.geometry.viewport);
                // let starts = new google.maps.LatLng(place.geometry.viewport.Xh.lo, place.geometry.viewport.Hh.lo);

                // a_from = [place.geometry.viewport.Xh.hi,place.geometry.viewport.Hh.hi];
                a_from = [place.geometry.location.lat(), place.geometry.location.lng()];
                document.getElementById('departure_latlng').value = JSON.stringify([place.geometry.location.lat(), place.geometry.location.lng()])

            } else {
                document.getElementById('departure_latlng').value = "";
                map.setCenter(place.geometry.location);
                map.setZoom(17);

            }
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);
        });
    }
    if(inputTo) {
        autocomplete2.addListener("place_changed", () => {
            marker.setVisible(false);
            let postcode = "";
            let address1 = "";
            const place2 = autocomplete2.getPlace();
            if (!place2.geometry || !place2.geometry.location) {
                // User entered the name of a Place that was not suggested and
                // pressed the Enter key, or the Place Details request failed.
                showTempPopup({
                    titleContent: '<p>'+ notificationText+'</p>',
                    bodyContent: addressMarkerError + ":'" + place2.name + "'",
                    popupSize: 'medium',
                })
                return;
            }
            for (const component2 of place2.address_components) {
                // @ts-ignore remove once typings fixed
                const componentType2 = component2.types[0];

                switch (componentType2) {
                    case "street_number": {
                        address1 = `${component2.long_name} ${address1}`;
                        break;
                    }

                    case "route": {
                        address1 += component2.short_name;
                        break;
                    }

                    case "postal_code": {
                        postcode = `${component2.long_name}${postcode}`;
                        break;
                    }

                    case "postal_code_suffix": {
                        postcode = `${postcode}-${component2.long_name}`;
                        break;
                    }
                }
            }
            document.getElementById("postalTo").value = postcode;
            document.getElementById("postalTo").parentNode.classList.remove("error");


            // If the place has a geometry, then present it on a map.
            if (place2.geometry.viewport) {
                map.fitBounds(place2.geometry.viewport);
                a_to = [place2.geometry.location.lat(), place2.geometry.location.lng()];
                document.getElementById('destination_latlng').value = JSON.stringify([place2.geometry.location.lat(), place2.geometry.location.lng()])

            } else {
                document.getElementById('destination_latlng').value = ""
                map.setCenter(place2.geometry.location);
                map.setZoom(17);

            }
            marker.setPosition(place2.geometry.location);
            marker.setVisible(true);
        });
    }

    directionsDisplay.setMap(map);

}
function arePointsNear(checkPoint, centerPoint, km) { // credits to user:69083
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}
function setMarker(location){
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(location[0], location[1]),
        map: map
    });
    marker.setMap(map);
    map.setCenter(marker.position);

    google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
            infowindow.setContent("location");
            infowindow.open(map, marker);
        }
    })(marker, 0));
}
function calcRoute(departureAddress, destinationPlaces, onepoint = false) {
    let destinationPoint = JSON.parse(destinationPlaces.pop()["latlng"])
    let destinationPointGoogle = new google.maps.LatLng(destinationPoint[0],destinationPoint[1]);
    let departureAddressGoogle =  new google.maps.LatLng(departureAddress[0],departureAddress[1]);

    let destinationPlacesGoogle = [];
    destinationPlaces.forEach(el=>{
        let coordinates = JSON.parse(el["latlng"])
       let a = {
            stopover: true,
                location: new google.maps.LatLng(coordinates[0],coordinates[1])
        }
        destinationPlacesGoogle.push(a)
    })

    var request = {
        origin: departureAddressGoogle,
        destination: destinationPointGoogle,
         waypoints: destinationPlacesGoogle,
        optimizeWaypoints: true,
        travelMode: 'DRIVING'
    };

    directionService.route(request, function(response, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            if(status == "ZERO_RESULTS"){
                showTempPopup({
                    titleContent: '<p>Notification</p>',
                    bodyContent: routeBuildErrorText,
                    popupSize: 'medium',
                })
            }else {
                showTempPopup({
                    titleContent: '<p>Notification</p>',
                    bodyContent: "directions request failed, status=" + status,
                    popupSize: 'medium',
                })
            }
        }
    });
}
window.initMap = initMap;

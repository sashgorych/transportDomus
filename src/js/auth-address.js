function initMap() {
    googleMapInit= true;

    const input = document.getElementById("city_name");
    const options = {
        fields: ["formatted_address", "geometry", "name","address_components"],
        strictBounds: false,
    };

    if(input) {
        var autocomplete = new google.maps.places.Autocomplete(input, options);
    }

    if(input) {
        autocomplete.addListener("place_changed", () => {
            let address1 = "";
            let postcode = "";
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) {
                showTempPopup({
                    titleContent: '<p>Notification</p>',
                    bodyContent: "No details available for input: '" + place.name + "'",
                    popupSize: 'medium',
                })
                return;
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
            // document.getElementById("expert_postal").value = postcode
            // document.getElementById("expert_postal").parentNode.classList.remove("error");
            // document.getElementById("expert_postal").parentNode.classList.add("active");


            // If the place has a geometry, then present it on a map.
            if (place.geometry.viewport) {
                document.getElementById('city_latlng').value = JSON.stringify([place.geometry.location.lat(), place.geometry.location.lng()])

            } else {
                document.getElementById('city_latlng').value = "";

            }
        });
    }

}

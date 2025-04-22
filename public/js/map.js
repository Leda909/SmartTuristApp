async function fetchGoogleApiKey() {
    const response = await fetch('/api-keys/google');
    const data = await response.json();
    return data.googleApiKey;
}

// Initialize the map
async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");

    const defaultPosition = { lat: 51.501364, lng: -0.1444649 };
    // Set up the map centered on the provided lat/lng
    map = new Map(document.getElementById("map"), {
        center: defaultPosition,
        zoom: 10,
        mapId: "DEMO_MAP_ID",
    });

    // Place a marker on the map
    // const markers = new AdvancedMarkerElement({
    //     map: map,
    //     position: defaultPosition,
    //     title: 'Your Location',
    // });

    initAutocomplete(map);
}

async function createMap(googleApiKey) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      // call initMap by google
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&libraries=places&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
}

// Function to orchestrate the loading of the map
async function init() {
    try {
      const googleApiKey = await fetchGoogleApiKey();
      await createMap(googleApiKey);
      // initMap will be called automatically by the Google Maps API callback
    } catch (error) {
      console.error('Error loading the map:', error);
    }
}
  
// Call the init function to start the process
init();

async function initAutocomplete(map) {
    const input = document.getElementById('YourLocation');
    const autocomplete = new google.maps.places.SearchBox(input);

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    let markers= [];

    autocomplete.addListener("places_changed", () => {
        const places = autocomplete.getPlaces();
        console.log(places);

        if (places.length == 0) {
        return;
        }
    
        // Clear out the old markers.
        markers.forEach((marker) => {
        marker.setMap(null);
        });
        markers = [];
    
        // For each place, get the icon, name and location.
        const bounds = new google.maps.LatLngBounds();
    
        places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry");
            return;
        }
       
        // Create a marker for each place.
        markers.push(
            new AdvancedMarkerElement({
            map,
            title: place.name,
            position: place.geometry.location,
            }),
        );
        if (place.geometry.viewport) {
            // Only geocodes have viewport.
            bounds.union(place.geometry.viewport);
        } else {
            bounds.extend(place.geometry.location);
        }
        });
        map.fitBounds(bounds);
    });
}



// Fetch Google Map API key from server configuration
async function fetchGoogleApiKey() {
    const response = await fetch('/api-keys/google');
    const data = await response.json();
    return data.googleApiKey;
}

function getLocation() {
    if (navigator.geolocation) {
        // console.log("Testing navigator.geolocation");
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        document.getElementById('location').innerHTML = "Geolocation is not supported by this browser.";
    }
}


function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            document.getElementById('location').innerHTML = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            document.getElementById('location').innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            document.getElementById('location').innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            document.getElementById('location').innerHTML = "An unknown error occurred.";
            break;
    }
}

async function showPosition(position) {
    // console.log("Testing Showpositions function");
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    geoLocation = { lat: latitude, lng: longitude };

    document.getElementById('latitude').value = latitude;
    document.getElementById('longitude').value = longitude;

    const googleApiKey = await fetchGoogleApiKey();
    // Use a geocoding service to convert the lat/lng to an address
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleApiKey}`)
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            if (data.status === "OK") {
                const startLocation = data.results[0].formatted_address;
                document.getElementById('YourLocation').value = startLocation;
            } else {
                document.getElementById('location').innerHTML = "Unable to retrieve address.";
            }
        })
        .catch(error => console.error('Error:', error));
}
// Import the Express framework for building web applications
const express = require('express');
// Create an Express application instance
const app = express();
// Import the path module to work with file and directory paths
const path = require('path');
// Import body-parser to parse incoming request bodies
const bodyParser = require('body-parser');
// Import axios for making HTTP requests
const axios = require('axios');
// Import CORS to allow cross-origin requests
const cors = require('cors');
// Load environment variables from a .env file into process.env
require("dotenv").config(); 
// Define the port to run the server on, defaulting to 4000 if not specified
const PORT = process.env.PORT || 3000;
// Define the Google Maps API key from environment variables
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAP_API_KEY;


// --------------- Middleware -------------
// Use body-parser to parse JSON bodies of incoming requests
app.use(bodyParser.json());
// allow cross-origin requests from the specified origin
app.use(cors({
    origin: 'http://localhost:3300'
}));

// Serve static files from the 'public' directory
// Use static server to serve the Express Yourself Website
app.use(express.static('public')); 

// Start the server and listen for incoming requests on the specified port
app.listen(PORT, () => {
    // Log a message to the console indicating that the server is running and on which port
    console.log(`Server is listening on ${PORT}`);
});

// Route to handle GET requests to the root URL ('/')
app.get('/', function(req, res) {
    // Send the index.html file located in the 'public' directory as the response
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint to get the Google API key
app.get('/api-keys/google', (req, res) => {
    res.json({
        googleApiKey: process.env.Google_MAP_API_KEY,
    });
});

// Endpoint to handle POST requests for formData submission to Google Nerby Search API
app.post('/suggestedPlaces', async function(req, res){
    // Log the received request body
    console.log('Received request body:', req.body);

    let typeOfPlace = req.body.typeOfPlace;
    let startLocation = req.body.startLocation;
    let latitude = req.body.latitude;
    let longitude = req.body.longitude;
    // Get the radius from the request body (in kilometers)
    const radiusInKm = parseFloat(req.body.radius);
    // Check if the radius is a valid number and greater than 0
    if (isNaN(radiusInKm) || radiusInKm < 0) {
        return res.status(400).json({ error: 'Invalid radius value' });
    }

    // Convert the radius to meters
    const radiusInMeters = radiusInKm * 1000;

    // console.log recived inputs
    console.log(`Radius in meters: ${radiusInMeters}`);
    console.log(`Recieved typeOfPlace : ${typeOfPlace}`);
    console.log(`Received startLocation: ${startLocation}`);
    console.log(`Received latitude: ${latitude}`);
    console.log(`Received longitude: ${longitude}`);

    try {
        // Check if the typeOfPlace is provided
        // console.log(`Received type: ${type}`);

        // Make http request to Google Map Nearby Search API
        const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
            params: {
                location: `${latitude},${longitude}`,
                radius: radiusInMeters,
                type: typeOfPlace,
                key: GOOGLE_MAPS_API_KEY
            }
        });

        // if response status is not OK, send an error message
        if (response.data.status !== 'OK') {
            return res.status(500).json({ error: response.data.error_message || 'Failed to fetch places' });
        }

        // limiting result for (2 places) to reduce the Api overload 
        const places = response.data.results.slice(0, 2).map(place => ({
            name: place.name,
            address: place.vicinity,  // use vicinity for nearby address, like street name
            location: place.geometry.location,
            place_id: place.place_id
        }));

        // Check if any places were found, if not ==> send a custom error message
        if (places.length === 0) {
            return res.status(404).json({ error: 'No places found within the specified radius. Try increasing the distance and search again.' });
        }

        // console.log each place's details
        places.forEach(place => {
            console.log(`Name: ${place.name}`);
            console.log(`Address: ${place.address}`);
            console.log(`Location: Latitude: ${place.location.lat}, Longitude: ${place.location.lng}`);
            console.log(`Place ID: ${place.place_id}`);
            console.log('---'); // Separator for readability
        });

    // error handling
    } catch (error) {
        console.error('Error fetching places:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }

});
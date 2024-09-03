// Import the Express framework for building web applications
const express = require('express');
// Create an Express application instance
const app = express();
// Import the path module to work with file and directory paths
const path = require('path');
// Import body-parser to parse incoming request bodies
const bodyParser = require('body-parser'); 
// Load environment variables from a .env file into process.env
require("dotenv").config(); 
// Define the port to run the server on, defaulting to 4000 if not specified
const PORT = process.env.PORT || 3000;


// Middleware
// Use body-parser to parse JSON bodies of incoming requests
app.use(bodyParser.json());

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
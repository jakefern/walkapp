// index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Load environment variables from .env file
require('dotenv').config();
console.log("Environment Variables: ", process.env);

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Walkable Itinerary Backend');
});

const types = [
  "night_club",
  "bar",
  "restaurant",
  "food",
  "point_of_interest",
  "establishment"
].join('|')

/**
 * Endpoint to fetch restaurant locations using Google API.
 * @route POST /api/restaurants
 * @param {string} location - The latitude and longitude of the starting location in the format "lat,lng".
 * @param {number} radius - The radius within which to search for restaurants, in meters.
 * @returns {object} - A JSON object containing the restaurant data from the Google Places API.
 */
app.post('/api/restaurants', async (req, res) => {
  const { location, radius } = req.body; // Extract location and radius from the request body
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // Get the API key from environment variables

  try {
    // Make a request to the Google Places API to get nearby restaurants
    const placesResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location: location,
        radius: radius,
        type: types,
        key: apiKey
      }
    });

    const places = placesResponse.data.results;

    if (places.length === 0) {
      return res.json({ restaurants: [] });
    }

    // Step 2: Get the coordinates of all restaurants
    const destinations = places.map(place => `${place.geometry.location.lat},${place.geometry.location.lng}`).join('|');

    // Step 3: Use Distance Matrix API to calculate walking distances
    const distanceMatrixResponse = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
      params: {
        origins: location, // Starting location
        destinations: destinations, // All restaurant locations
        mode: 'walking', // Calculate walking distance
        key: apiKey,
      },
    });

    const distances = distanceMatrixResponse.data.rows[0].elements;

    // Step 4: Combine the places with their respective distances
    const restaurantsWithDistances = places.map((place, index) => ({
      ...place,
      distance: distances[index].distance.text, // Add the distance text (e.g., "1.2 km")
      distanceValue: distances[index].distance.value, // Add the distance value (in meters) for sorting or further calculations
    }));
    
    console.log(restaurantsWithDistances)

    res.json({ restaurants: restaurantsWithDistances });
  } catch (error) {
    console.error('Error fetching places or distances:', error);
    res.status(500).json({ error: 'Failed to fetch places or distances' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
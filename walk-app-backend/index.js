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
    const response = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
      params: {
        location: location,
        radius: radius,
        type: types,
        key: apiKey
      }
    });

    // Send the response data back to the client
    res.json(response.data);
  } catch (error) {
    // Log the error and send an error response to the client
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ error: 'Failed to fetch restaurants' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
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
 * Endpoint to generate a walking route with multiple places, based on the total walking distance.
 * This endpoint dynamically calculates the walking distance between consecutive places to ensure
 * the total distance matches the user's input.
 * @route POST /api/generateRoute
 * @param {string} location - The latitude and longitude of the starting location in the format "lat,lng".
 * @param {number} totalDistance - The total walking distance in miles.
 * @returns {object} - A JSON object containing the route data with multiple places.
 */
app.post('/api/generateRoute', async (req, res) => {
  const { location, totalDistance } = req.body; // Extract location and totalDistance from the request body
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY; // Get the API key from environment variables

  let remainingDistance = totalDistance * 1609.34; // Convert miles to meters
  let currentLocation = location;
  let route = [];
  let selectedPlaceIds = new Set(); // Track selected places to prevent duplicates

  try {
    while (remainingDistance > 0) {
      const placesResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json`, {
        params: {
          location: currentLocation,
          radius: Math.min(remainingDistance, 5000), // Radius in meters
          type: types,
          key: apiKey,
        },
      });

      const places = placesResponse.data.results;

      if (!places || places.length === 0) {
        console.error('No places found or response is invalid');
        break;
      }

      const destinations = places.map(place => `${place.geometry.location.lat},${place.geometry.location.lng}`).join('|');

      const distanceMatrixResponse = await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json`, {
        params: {
          origins: currentLocation,
          destinations: destinations,
          mode: 'walking',
          key: apiKey,
        },
      });

      console.log("Distance Matrix Response:", distanceMatrixResponse.data);

      if (!distanceMatrixResponse.data.rows || !distanceMatrixResponse.data.rows[0] || !distanceMatrixResponse.data.rows[0].elements) {
        console.error('Invalid Distance Matrix API response');
        break;
      }

      const distances = distanceMatrixResponse.data.rows[0].elements;

      console.log("Distances:", distances);
      console.log("Remaining Distance (meters):", remainingDistance);

      let selectedPlaceIndex = -1;
      for (let i = 0; i < distances.length; i++) {
        const place = places[i];
        const distanceInMiles = distances[i].distance.value / 1609.34; // Convert distance from meters to miles

        if (
          distances[i].distance &&
          distanceInMiles > 0 &&
          distanceInMiles <= remainingDistance / 1609.34 && // Convert remaining distance to miles for comparison
          !selectedPlaceIds.has(place.place_id) // Check if the place has already been selected
        ) {
          selectedPlaceIndex = i;
          break;
        }
      }

      if (selectedPlaceIndex === -1) {
        console.error('No suitable place found within the remaining distance');
        break;
      }

      const selectedPlace = places[selectedPlaceIndex];
      const distanceToPlaceInMeters = distances[selectedPlaceIndex].distance.value;
      const distanceToPlaceInMiles = distanceToPlaceInMeters / 1609.34; // Convert distance to miles

      // Reduce remaining distance by the distance to the selected place (in meters)
      remainingDistance -= distanceToPlaceInMeters;

      console.log("Selected Place:", selectedPlace.name);
      console.log("Distance to Place (miles):", distanceToPlaceInMiles);
      console.log("New Remaining Distance (miles):", remainingDistance / 1609.34);

      // Add the selected place to the route and mark it as selected
      route.push({
        ...selectedPlace,
        distance: `${distanceToPlaceInMiles.toFixed(2)} miles`, // Store the distance in miles, formatted to 2 decimal places
        distanceValue: distanceToPlaceInMiles, // Store the distance value in miles for further use
      });

      selectedPlaceIds.add(selectedPlace.place_id); // Track the selected place to avoid duplicates

      currentLocation = `${selectedPlace.geometry.location.lat},${selectedPlace.geometry.location.lng}`;
    }

    if (route.length === 0) {
      console.error('Route generation failed; no places were added to the route');
      res.status(500).json({ error: 'Failed to generate route' });
      return;
    }

    res.json({ route });
  } catch (error) {
    console.error('Error generating route:', error);
    res.status(500).json({ error: 'Failed to generate route' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
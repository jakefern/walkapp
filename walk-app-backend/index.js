// index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

// Load environment variables from .env file
require('dotenv').config();
// console.log("Environment Variables: ", process.env);

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());


// Load the local data from a JSON file
const localPlaces = require('./placesWithDetails.json');
console.log("Local places size: ", localPlaces.length)

// Configuration: Toggle between local and external API use
const useLocalData = process.env.USE_LOCAL_DATA === 'true';

console.log(`Using ${useLocalData ? 'local data' : 'Google Maps API'}`);

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory cache for API responses
const cache = {};

// Track API request count within a given time period
let requestCount = 0;
const maxRequestsPerMinute = 60;

// Reset the request count every minute
setInterval(() => {
  requestCount = 0;
}, 60000); // 60,000ms = 1 minute

/**
 * Fetch data from a URL with caching.
 * 
 * @param {string} url - The URL to fetch data from.
 * @param {object} params - The parameters for the API request.
 * @returns {Promise<object>} - The API response data.
 */
const fetchWithCache = async (url, params) => {
  const cacheKey = `${url}_${JSON.stringify(params)}`;

  if (cache[cacheKey]) {
    console.log(`Cache hit for ${cacheKey}`);
    return cache[cacheKey];
  }

  if (requestCount >= maxRequestsPerMinute) {
    throw new Error('Max requests per minute reached');
  }

  try {
    console.log(`Fetching data for ${cacheKey}`);
    requestCount++;
    const response = await axios.get(url, { params });
    cache[cacheKey] = response.data; // Store in cache

     // Log the response for debugging
    //  console.log(`API Response for ${cacheKey}:`, JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error.message);
    throw error;
  }
};

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
  const { location, totalDistance } = req.body;
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  let remainingDistance = totalDistance * 1609.34; // Convert miles to meters
  let currentLocation = location;
  let route = [];
  let selectedPlaceIds = new Set();

  try {
    while (remainingDistance > 0) {
      let places;

      if (useLocalData) {
        // Use local data
        console.log('Using local data for places ', localPlaces.length);
        places = localPlaces;
      } else {
        // Use Google Maps API
        const placesResponse = await fetchWithCache(
          'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
          {
            location: currentLocation,
            radius: Math.min(remainingDistance, 5000), // Radius in meters
            type: types,
            key: apiKey,
          }
        );
        places = placesResponse.results;
      }

      if (!places || places.length === 0) {
        console.error('No places found or response is invalid');
        break;
      }

      const destinations = places.map(place => `${place.geometry.location.lat},${place.geometry.location.lng}`).join('|');

      const distanceMatrixResponse = await fetchWithCache(
        'https://maps.googleapis.com/maps/api/distancematrix/json',
        {
          origins: currentLocation,
          destinations: destinations,
          mode: 'walking',
          key: apiKey,
        }
      );

      // Log the entire response for debugging purposes
      console.log("Distance Matrix Response:", JSON.stringify(distanceMatrixResponse, null, 2));

      // Check if the 'rows' property exists and contains the expected data
      if (!distanceMatrixResponse || !distanceMatrixResponse.rows || !Array.isArray(distanceMatrixResponse.rows) || distanceMatrixResponse.rows.length === 0 || !distanceMatrixResponse.rows[0].elements) {
        console.error('Invalid or unexpected Distance Matrix API response');
        break;
      }

      const distances = distanceMatrixResponse.rows[0].elements;

      let selectedPlaceIndex = -1;
      for (let i = 0; i < distances.length; i++) {
        const place = places[i];
        const distanceInMiles = distances[i].distance.value / 1609.34; // Convert distance from meters to miles

        if (
          distances[i].distance &&
          distanceInMiles > 0 &&
          distanceInMiles <= remainingDistance / 1609.34 &&
          !selectedPlaceIds.has(place.place_id)
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

      remainingDistance -= distanceToPlaceInMeters;

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
// index.js
const express = require('express');
const axios = require('axios');

// Load environment variables from .env file
require('dotenv').config();
console.log("Google Maps API Key:", process.env.REACT_APP_GOOGLE_MAPS_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route to test the server
app.get('/', (req, res) => {
  res.send('Walkable Itinerary Backend');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

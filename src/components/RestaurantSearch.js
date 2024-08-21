import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantDisplay from './RestaurantDisplay';

/**
 * RestaurantSearch - Component that fetches and displays a route with multiple places
 * that maximizes the total walking distance based on user input.
 *
 * @param {string} location - The latitude and longitude of the starting location in the format "lat,lng".
 * @param {number} walkingDistance - The total walking distance in miles.
 * @returns {JSX.Element} A JSX element containing the restaurant search results.
 */
const RestaurantSearch = ({ location, walkingDistance }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post('http://localhost:3001/api/generateRoute', { location, totalDistance: walkingDistance });
        setRestaurants(response.data.route || []); // Assuming the route array is returned in `response.data.route`
        console.log("Generated route:", response.data.route); // Debugging line
      } catch (err) {
        setError('Failed to generate route');
        setRestaurants([]);
      }

      setLoading(false);
    };

    if (location && walkingDistance) {
      fetchRoute();
    }
  }, [location, walkingDistance]);

  return (
    <div>
      <h2>Generated Route</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {restaurants.length > 0 ? (
        <ul>
          {restaurants.map((restaurant, index) => (
            <RestaurantDisplay key={index} restaurant={restaurant} />
          ))}
        </ul>
      ) : (
        !loading && <p>No places found</p>
      )}
    </div>
  );
};

export default RestaurantSearch;

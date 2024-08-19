import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RestaurantDisplay from './RestaurantDisplay';

/**
 * RestaurantSearch - Component that fetches and displays restaurant locations based on the given location and walking distance.
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
    // console.log("Using location:", location); // Debugging line 
    const fetchRestaurants = async () => {
      setLoading(true);
      setError(null);
      const radius = walkingDistance * 1609.34; // Convert miles to meters
      try {
        const response = await axios.post('http://localhost:3001/api/restaurants', { location, radius });
        setRestaurants(response.data.restaurants || []);
        console.log(response.data)
      } catch (err) {
        setError('Failed to fetch restaurants');
        setRestaurants([]);
      }
      setLoading(false);
    };

    if (location && walkingDistance) {
      fetchRestaurants();
    }
  }, [location, walkingDistance]);
  // console.log(restaurants)
  return (
    <div>
      <h2>Restaurants and Walking Distances</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {restaurants.length > 0 ? (
        <ul>
          {restaurants.map((restaurant, index) => (
            <RestaurantDisplay key={index} restaurant={restaurant} />
          ))}
        </ul>
      ) : (
        !loading && <p>No restaurants found</p>
      )}
    </div>
  );
};

export default RestaurantSearch;

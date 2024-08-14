import React from 'react';
import PropTypes from 'prop-types';

/**
 * RestaurantDisplay - Component that displays a single restaurant's details.
 *
 * @param {object} restaurant - An object containing details of the restaurant. Passed from RestaurantSearch.
 * @param {string} restaurant.name - The name of the restaurant.
 * @param {string} restaurant.vicinity - The address of the restaurant.
 * @param {number} restaurant.rating - The rating of the restaurant.
 * @returns {JSX.Element} A JSX element displaying the restaurant's details.
 */
const RestaurantDisplay = ({ restaurant }) => {
  return (
    <li>
      <h3>{restaurant.name}</h3>
      <p>{restaurant.vicinity}</p>
      <p>Rating: {restaurant.rating}</p>
    </li>
  );
};

RestaurantDisplay.propTypes = {
  restaurant: PropTypes.shape({
    name: PropTypes.string.isRequired,
    vicinity: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
  }).isRequired,
};

export default RestaurantDisplay;

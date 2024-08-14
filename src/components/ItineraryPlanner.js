import React, { useState } from 'react';
import LocationInput from './LocationInput';
import TimeSelection from './TimeSelection';
import RestaurantSearch from './RestaurantSearch';

/**
 * ItineraryPlanner - A component that manages the state for location and walking distance,
 * and coordinates the flow of data between LocationInput, TimeSelection, and RestaurantSearch.
 *
 * @returns {JSX.Element} The ItineraryPlanner component.
 */
const ItineraryPlanner = () => {
  const [location, setLocation] = useState(''); // Initial empty state for location
  const [walkingDistance, setWalkingDistance] = useState(''); // Initial empty state for walking distance
  const [showResults, setShowResults] = useState(false); // State to control when to show results

  const handleGenerateRoute = () => {
    console.log("Location used for search:", location);
    setShowResults(true); // Show the RestaurantSearch component when route generation is triggered
  };

  return (
    <div>
      <LocationInput setLocation={setLocation} />
      <TimeSelection
        setWalkingDistance={setWalkingDistance}
        onGenerateRoute={handleGenerateRoute}
      />
      {showResults && (
        <RestaurantSearch
          location={location}
          walkingDistance={walkingDistance}
        />
      )}
    </div>
  );
};

export default ItineraryPlanner;

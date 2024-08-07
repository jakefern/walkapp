import React, { useState, useRef, useCallback } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

/**
 * useLocation - Custom hook to manage location input using Google Places Autocomplete.
 *
 * This hook initializes the Google Maps script and manages the state for the location input.
 * It also provides a callback function to handle changes in the autocomplete place selection.
 *
 * @returns {Object} An object containing:
 * @returns {string} location - The current value of the location input.
 * @returns {function} setLocation - A state setter function to update the location state.
 * @returns {React.RefObject} autocompleteRef - A reference object for the Google Places Autocomplete instance.
 * @returns {boolean} isLoaded - A flag indicating whether the Google Maps script has finished loading.
 * @returns {Error|null} loadError - An error object if there was an error loading the Google Maps script, or null if no error occurred.
 * @returns {function} handlePlaceChanged - A callback function to update the location state when the place changes.
 */
const useLocation = () => {
  const [location, setLocation] = useState('');
  const autocompleteRef = useRef(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      setLocation(place.formatted_address);
    }
  }, []);

  return {
    location,
    setLocation,
    autocompleteRef,
    isLoaded,
    loadError,
    handlePlaceChanged,
  };
};

/**
 * LocationInput - Component that renders a UI for location input using Google Places Autocomplete.
 *
 * This component uses the `useLocation` hook to manage the state of the location input
 * and handles the loading state and errors related to the Google Maps script.
 *
 * @returns {JSX.Element} A JSX element containing the location input UI.
 */
const LocationInput = () => {
  const {
    location,
    setLocation,
    autocompleteRef,
    isLoaded,
    loadError,
    handlePlaceChanged,
  } = useLocation();

  if (loadError) {
    return <div>Error loading Google Maps script</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Autocomplete
        onLoad={(autocomplete) => {
          autocompleteRef.current = autocomplete;
        }}
        onPlaceChanged={handlePlaceChanged}
      >
        <TextField
          label="Starting location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          fullWidth
        />
      </Autocomplete>
    </Box>
  );
};

export default LocationInput;

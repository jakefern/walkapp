import React, { useState, useRef, useCallback } from 'react';
import { Box, TextField } from '@mui/material';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

/**
 * LocationInput - Component that allows the user to input a location using Google Places Autocomplete.
 *
 * Uses Google Maps API to provide location suggestions as the user types. 
 * Upon selecting a place from the suggestions, the component extracts the latitude and longitude coordinates 
 * and passes them to the parent component via the `setLocation` function.
 *
 * @param {function} setLocation - A function passed from the parent component to update the location state. 
 *                                 It receives the selected location's coordinates as a string in the format "lat,lng".
 *
 * @returns {JSX.Element} A JSX element containing the location input UI with Google Places Autocomplete.
 */
const LocationInput = ({ setLocation }) => {
  const autocompleteRef = useRef(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const coordinates = `${lat},${lng}`;
      console.log('Coordinates selected:', coordinates); // Debugging line
      setLocation(coordinates);
    } else {
      console.log('Place not selected or no geometry found'); // Debugging line
    }
  }, [setLocation]);


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
          onChange={(e) => setLocation(e.target.value)} // This updates location as the user types
          fullWidth
        />
      </Autocomplete>
    </Box>
  );
};

export default LocationInput;
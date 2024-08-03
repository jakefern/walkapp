import React, { useState, useRef, useCallback } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

function LocationInput() {
  const [location, setLocation] = useState('');
  const autocompleteRef = useRef(null);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDFy4M912mf6iKUKwOUrcC7n3Qv9jtlrKU', // API Key
    libraries,
  });

  const handlePlaceChanged = useCallback(() => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.formatted_address) {
      setLocation(place.formatted_address);
    }
  }, []);

  if (loadError) {
    return <div>Error loading Google Maps script</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ mb: 2 }}>
      {/* <Typography variant="h4" gutterBottom padding="40px">
        Your Starting Location
      </Typography> */}
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
}

export default LocationInput;

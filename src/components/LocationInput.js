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


// import React, { useState, useRef, useCallback } from 'react';
// import { Box, TextField, Typography } from '@mui/material';
// import { useLoadScript, Autocomplete } from '@react-google-maps/api';

// const libraries = ['places'];

// /**
//  * useLocation - Custom hook to manage location input using Google Places Autocomplete.
//  *
//  * This hook initializes the Google Maps script and manages the state for the location input.
//  * It also provides a callback function to handle changes in the autocomplete place selection.
//  *
//  * @returns {Object} An object containing:
//  * @returns {string} location - The current value of the location input.
//  * @returns {function} setLocation - A state setter function to update the location state.
//  * @returns {React.RefObject} autocompleteRef - A reference object for the Google Places Autocomplete instance.
//  * @returns {boolean} isLoaded - A flag indicating whether the Google Maps script has finished loading.
//  * @returns {Error|null} loadError - An error object if there was an error loading the Google Maps script, or null if no error occurred.
//  * @returns {function} handlePlaceChanged - A callback function to update the location state when the place changes.
//  */
// const useLocation = () => {
//   const [location, setLocation] = useState('');
//   const autocompleteRef = useRef(null);
//   const { isLoaded, loadError } = useLoadScript({
//     googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   const handlePlaceChanged = useCallback(() => {
//     const place = autocompleteRef.current.getPlace();
//     if (place && place.formatted_address) {
//       setLocation(place.formatted_address);
//     }
//   }, []);

//   return {
//     location,
//     setLocation,
//     autocompleteRef,
//     isLoaded,
//     loadError,
//     handlePlaceChanged,
//   };
// };

// /**
//  * LocationInput - Component that renders a UI for location input using Google Places Autocomplete.
//  *
//  * This component uses the `useLocation` hook to manage the state of the location input
//  * and handles the loading state and errors related to the Google Maps script.
//  *
//  * @returns {JSX.Element} A JSX element containing the location input UI.
//  */
// const LocationInput = () => {
//   const {
//     location,
//     setLocation,
//     autocompleteRef,
//     isLoaded,
//     loadError,
//     handlePlaceChanged,
//   } = useLocation();

//   if (loadError) {
//     return <div>Error loading Google Maps script</div>;
//   }

//   if (!isLoaded) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Box sx={{ mb: 2 }}>
//       <Autocomplete
//         onLoad={(autocomplete) => {
//           autocompleteRef.current = autocomplete;
//         }}
//         onPlaceChanged={handlePlaceChanged}
//       >
//         <TextField
//           label="Starting location"
//           value={location}
//           onChange={(e) => setLocation(e.target.value)}
//           fullWidth
//         />
//       </Autocomplete>
//     </Box>
//   );
// };

// export default LocationInput;
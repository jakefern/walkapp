import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import TimeSelection from './components/TimeSelection';
import LocationInput from './components/LocationInput';
import Header from './components/Header';
import RestaurantSearch from './components/RestaurantSearch';

/**
 * App - Main component that renders the application.
 *
 * @returns {JSX.Element} A JSX element containing the main application UI.
 */
function App() {
  return (
    <Container>
      <Header />
      <LocationInput />
      <TimeSelection />
    </Container>
  );
}

export default App;

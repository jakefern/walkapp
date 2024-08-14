import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import Header from './components/Header';
import ItineraryPlanner from './components/ItineraryPlanner';

/**
 * App - Main component that renders the application.
 *
 * @returns {JSX.Element} A JSX element containing the main application UI.
 */
function App() {
  return (
    <Container>
      <Header />
      <ItineraryPlanner />
    </Container>
  );
}

export default App;

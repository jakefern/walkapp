import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import TimeSelection from './TimeSelection';
import LocationInput from './LocationInput';
import logo from './walkable-test-logo.png';
// import GenerateButtton from '.TimeSelection';


function App() {
  return (
    <Container>
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <img src={logo} alt="Walkable Logo" style={{ width: '200px', marginBottom: '20px' }} />
      </Box>
        <LocationInput />
        <TimeSelection />
    </Container>
  );
}

export default App;

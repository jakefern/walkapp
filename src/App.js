import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import TimeSelection from './TimeSelection';
import LocationInput from './LocationInput';
import Header from './Header';


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

import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { Box } from '@mui/material';
import Button from '@mui/joy/Button';

// This is a large function that styles and takes the date inputs, and styles a button to generate the user's day.

function TimeSelection() {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(dayjs('2022-04-17T18:30'));

  useEffect(() => {
    // Get the current time
    const now = new Date();
    
    // If the current time is valid, set it as the start time
    if (!isNaN(now.getTime())) {
      setStartTime(dayjs(now));
    } else {
      // If the current time is not valid, set default to 7 AM
      const defaultTime = dayjs().hour(7).minute(0);
      setStartTime(defaultTime);
    }
  }, []);

  const handleGenerateRoute = () => {
    console.log('Generating route with:', startTime, endTime);
    // Add your route generation logic here
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TimeField
          label="When you want to start your day"
          value={startTime}
          onChange={(newValue) => setStartTime(newValue)}
        />
        <TimeField
          label="When you want to end your day"
          value={endTime}
          onChange={(newValue) => setEndTime(newValue)}
        />
         <Button color="success" onClick={handleGenerateRoute} variant="solid" size="lg">
          Start My Day
        </Button>
      </Box>
    </LocalizationProvider>
  );
}

export default TimeSelection;

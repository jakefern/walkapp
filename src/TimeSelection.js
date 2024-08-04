import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { Box } from '@mui/material';
import Button from '@mui/joy/Button';

/**
 * useTimeSettings - Custom hook to manage time settings for the application.
 *
 * This hook initializes the start time based on the current time or defaults
 * to 7 AM if the current time is invalid. It also sets a fixed end time.
 *
 * @returns {Object} An object containing:
 * @returns {dayjs.Dayjs|null} startTime - The current value of the start time.
 * @returns {function} setStartTime - A state setter function to update the start time.
 * @returns {dayjs.Dayjs} endTime - The current value of the end time.
 * @returns {function} setEndTime - A state setter function to update the end time.
 */
const useTimeSettings = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(dayjs('2022-04-17T18:30'));

  useEffect(() => {
    const now = new Date();
    if (!isNaN(now.getTime())) {
      setStartTime(dayjs(now));
    } else {
      const defaultTime = dayjs().hour(7).minute(0);
      setStartTime(defaultTime);
    }
  }, []);

  return { startTime, setStartTime, endTime, setEndTime };
};

/**
 * TimeSelection - Component that renders a UI for selecting start and end times
 * and provides a button to generate a route based on these times.
 *
 * This component uses the `useTimeSettings` hook to manage the state of the
 * start and end times. It displays two `TimeField` components for the user to
 * select the times and a `Button` to initiate route generation.
 *
 * @returns {JSX.Element} A JSX element containing the time selection UI.
 */
const TimeSelection = () => {
  const { startTime, setStartTime, endTime, setEndTime } = useTimeSettings();
  console.log('Generating route with:', startTime, endTime);

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
        <Button color="success" variant="solid" size="lg"> 
          Start My Day
        </Button>
      </Box>
    </LocalizationProvider>
  );
};

export default TimeSelection;

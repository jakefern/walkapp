import React from 'react';
import Box from '@mui/material/Box';
import logo from './walkable-test-logo.png';

/**
 * Header - Component that renders the Walkable logo and all header related UI.
 *
 * @returns {JSX.Element} A JSX element containing the Header UI.
 */
const Header = () => {
  return (
    <Box sx={{ my: 4, textAlign: 'center' }}>
      <img src={logo} alt="Walkable Logo" style={{ width: '200px', marginBottom: '20px' }} />
    </Box>
  );
};

export default Header;
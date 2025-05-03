import React from 'react';
import { Box, Toolbar, CssBaseline } from '@mui/material';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        maxWidth: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      <CssBaseline />
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          m: 0,
          width: '100%',
          backgroundColor: '#F8F9FA',
          minHeight: '100vh',
          overflow: 'hidden'
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

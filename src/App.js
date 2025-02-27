import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material'; // Added Toolbar import
import CustomAppBar from './components/AppBar'; // Fixed case sensitivity
import Sidebar from './components/Sidebar';
import Dashboard from './Dashboard';
import Calendar from './Calendar';
import News from './News';
const App = () => {
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <CustomAppBar open={open} handleDrawerToggle={handleDrawerToggle} />
        <Sidebar open={open} handleDrawerClose={handleDrawerToggle} />
        
        <Box
          component="main"
          
          sx={{
            flexGrow: 1,
            transition: 'margin 0.3s ease',
            marginLeft: open ? '56px' : '56px',
            width: `calc(100% - ${open ? 56 : 56}px)`,
            marginTop: '64px', // Add this line to account for app bar height
            height: 'calc(100vh - 64px)', // Prevent vertical overflow
            overflow: 'auto', // Enable vertical scrolling
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/news" element={<News />} />
          </Routes>
        </Box>

      </Box>
    </Router>
  );
};

export default App;
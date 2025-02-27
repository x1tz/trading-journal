import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Dashboard, CalendarToday, Article, ChevronLeft } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ open, handleDrawerClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Calendar', icon: <CalendarToday />, path: '/calendar' },
    { text: 'News', icon: <Article />, path: '/news' },
  ];

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? 240 : 60,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 240 : 60,
          boxSizing: 'border-box',
          transition: 'width 0.3s ease',
          backgroundColor: '#1A2027',
          color: 'white',
          overflowX: 'hidden',
          marginTop: '64px', // Match AppBar height
          height: 'calc(100vh - 64px)', // Account for header
        },
      }}
    >
      <List sx={{ 
        pt: 2, 
        pb: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        {/* Top Section */}
        <div>
          
          <Divider sx={{ mb: 2 }} />
          
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#2D3842',
                },
                '&:hover': {
                  backgroundColor: '#2D3842',
                },
                borderRadius: '8px',
                margin: '8px',
                minHeight: '48px',
                justifyContent: open ? 'flex-start' : 'center', // Center the ListItem when closed
                transition: 'justify-content 0.3s ease',
              }}
            >
              <ListItemIcon sx={{ 
                color: 'inherit', 
                minWidth: '40px',
                
                }}>
                {item.icon}
              </ListItemIcon>
              {open && <ListItemText primary={item.text} />}
            </ListItem>
          ))}
        </div>

        {/* Bottom Spacer */}
        <div></div>
      </List>
    </Drawer>
  );
};

export default Sidebar;
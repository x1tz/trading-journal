import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import TradeForm from './TradeForm';

const TradesTable = ({ trades, refreshTrades, darkMode }) => {
  const [open, setOpen] = useState(false);

  // Color scheme for both modes
  const colorScheme = {
    light: {
      background: {
        header: '#1A2027',
        paper: '#ffffff',
        row: '#ffffff',
        alternateRow: '#f8f9fa'
      },
      text: {
        header: '#ffffff',
        primary: '#000000',
        secondary: '#616161'
      }
    },
    dark: {
      background: {
        header: '#2D3748',
        paper: '#1A202C',
        row: '#2D3748',
        alternateRow: '#2a2f3d'
      },
      text: {
        header: '#ffffff',
        primary: '#E2E8F0',
        secondary: '#A0AEC0'
      }
    }
  };

  const mode = darkMode ? 'dark' : 'light';

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography 
          variant="h5" 
          sx={{ color: colorScheme[mode].text.primary }}
        >
          Trade History
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            backgroundColor: darkMode ? '#4299E1' : '#1976D2',
            '&:hover': {
              backgroundColor: darkMode ? '#3182CE' : '#1565C0'
            }
          }}
        >
          Add Trade
        </Button>
      </Box>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { bgcolor: colorScheme[mode].background.paper } }}
      >
        <DialogContent>
          <TradeForm 
            onSuccess={() => {
              setOpen(false);
              refreshTrades();
            }}
            darkMode={darkMode}
          />
        </DialogContent>
      </Dialog>

      <TableContainer 
        component={Paper} 
        sx={{ 
          maxWidth: '100%', 
          overflowX: 'auto',
          backgroundColor: colorScheme[mode].background.paper
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{
              backgroundColor: colorScheme[mode].background.header,
              borderBottom: `2px solid ${darkMode ? '#4A5568' : '#E2E8F0'}`
            }}>
              {['Pair', 'Direction', 'Result', 'Risk/Reward', 'Open Date', 'Close Date'].map((header) => (
                <TableCell 
                  key={header}
                  sx={{ 
                    color: colorScheme[mode].text.header, 
                    fontWeight: 600, 
                    width: header === 'Result' ? '15%' : '15%',
                    py: 2
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {trades.map((trade) => (
              <TableRow 
                key={trade.id}
                sx={{ 
                  '&:nth-of-type(odd)': {
                    backgroundColor: colorScheme[mode].background.alternateRow
                  },
                  '&:hover': {
                    backgroundColor: darkMode ? '#2D3748' : '#f5f5f5'
                  }
                }}
              >
                <TableCell sx={{ color: colorScheme[mode].text.primary, width: '15%' }}>
                  {trade.pair}
                </TableCell>
                <TableCell sx={{ color: colorScheme[mode].text.primary, width: '15%' }}>
                  {trade.direction}
                </TableCell>
                <TableCell>
                  <Box
                    sx={{
                      display: 'inline-block',
                      borderRadius: '12px',
                      backgroundColor: 
                        trade.result === 'Win' ? 
                        (darkMode ? '#4CAF5040' : '#4CAF5020') : 
                        trade.result === 'Loss' ? 
                        (darkMode ? '#F4433640' : '#F4433620') : 
                        (darkMode ? '#9E9E9E40' : '#9E9E9E20'),
                      color: 
                        trade.result === 'Win' ? 
                        (darkMode ? '#A5D6A7' : '#4CAF50') : 
                        trade.result === 'Loss' ? 
                        (darkMode ? '#EF9A9A' : '#F44336') : 
                        (darkMode ? '#BDBDBD' : '#616161'),
                      fontWeight: 500,
                      textAlign: 'center',
                      minWidth: '50px',
                      whiteSpace: 'nowrap',
                      padding: '4px 12px'
                    }}
                  >
                    {trade.result?.toUpperCase()}
                  </Box>
                </TableCell>
                <TableCell sx={{ color: colorScheme[mode].text.primary, width: '15%' }}>
                  {trade.rr}
                </TableCell>
                <TableCell sx={{ color: colorScheme[mode].text.secondary, width: '20%' }}>
                  {new Date(trade.open_date).toLocaleString()}
                </TableCell>
                <TableCell sx={{ color: colorScheme[mode].text.secondary, width: '20%' }}>
                  {trade.closure_date ? 
                    new Date(trade.closure_date).toLocaleString() : 
                    <span style={{ color: colorScheme[mode].text.primary }}>Open</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TradesTable;
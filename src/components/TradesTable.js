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

const TradesTable = ({ trades, refreshTrades }) => {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Trade History</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => setOpen(true)}
        >
          Add Trade
        </Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogContent>
          <TradeForm 
            onSuccess={() => {
              setOpen(false);
              refreshTrades();
            }} 
          />
        </DialogContent>
      </Dialog>

    <TableContainer component={Paper} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
        <Table sx={{ minWidth: 650 }} aria-label="trades table">
        <TableHead>
        <TableRow>
            <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Pair</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Direction</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Result</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Risk/Reward</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Open Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Close Date</TableCell>
        </TableRow>
        </TableHead>

        <TableBody>
        {trades.map((trade) => (
            <TableRow key={trade.id}>
            <TableCell sx={{ width: '15%' }}>{trade.pair}</TableCell>
            <TableCell sx={{ width: '15%' }}>{trade.direction}</TableCell>
            <TableCell sx={{ 
                width: '15%',
                color: trade.result === 'Win' ? '#4CAF50' : '#F44336',
                fontWeight: 500
            }}>
                {trade.result?.toUpperCase()}
            </TableCell>
            <TableCell sx={{ width: '15%' }}>1:{trade.rr}</TableCell>
            <TableCell sx={{ width: '20%' }}>
                {new Date(trade.open_date).toLocaleString()}
            </TableCell>
            <TableCell sx={{ width: '20%' }}>
                {trade.closure_date ? 
                new Date(trade.closure_date).toLocaleString() : 
                'Open'}
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
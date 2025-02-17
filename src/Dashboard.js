import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';
import supabase from './supabaseClient';
import TradesTable from './components/TradesTable';

const Dashboard = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrades = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .order('open_date', { ascending: false });

    if (!error) setTrades(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrades();
  }, []);

  const calculateStats = () => {
    const totalTrades = trades.length;
    const winningTrades = trades.filter(t => t.result === 'Win').length;
    const winRate = totalTrades > 0 
      ? ((winningTrades / totalTrades) * 100).toFixed(1)
      : 0;

    const totalRR = trades.reduce((sum, trade) => sum + (parseFloat(trade.rr) || 0), 0);
    const avgRR = trades.length > 0 ? (totalRR / trades.length).toFixed(2) : 0;

    return { totalTrades, winRate, avgRR };
  };

  const stats = calculateStats();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Trading Journal
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Total Trades</Typography>
            <Typography variant="h3">{stats.totalTrades}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Win Rate</Typography>
            <Typography variant="h3">{stats.winRate}%</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Avg R:R</Typography>
            <Typography variant="h3">{stats.avgRR}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <TradesTable trades={trades} refreshTrades={fetchTrades} />
    </Container>
  );
};

export default Dashboard;
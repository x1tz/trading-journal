import React from 'react';
import { Container, Grid, Paper, Typography } from '@mui/material';

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Trading Journal Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Example Card 1 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6">Total Trades</Typography>
            <Typography variant="h4">125</Typography>
          </Paper>
        </Grid>

        {/* Example Card 2 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6">Win Rate</Typography>
            <Typography variant="h4">65%</Typography>
          </Paper>
        </Grid>

        {/* Example Card 3 */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6">Total Profit</Typography>
            <Typography variant="h4">$2,340</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;

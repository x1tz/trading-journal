import React, { useState } from 'react';
import supabase from '../supabaseClient';
import {
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Grid,
  Typography,
  Paper
} from '@mui/material';

const PAIRS = ['XAU/USD', 'EUR/USD', 'GBP/USD', 'AUD/USD'];
const ENTRIES = ['FVG', 'OB'];
const DIRECTIONS = ['ERL', 'IRL'];
const TIMEFRAMES = ['4H'];

const TradeForm = ({ onSuccess }) => {

  const [formData, setFormData] = useState({
    pair: PAIRS[0],
    result: 'win',
    trade_type: 'buy',
    direction: DIRECTIONS[0],
    dp: false,
    entry_type: ENTRIES[0],
    rr: '',
    timeframe: TIMEFRAMES[0],
    open_date: '',
    closure_date: '',
    url: '',
    comments: '',
  });
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { data, error } = await supabase.from('trades').insert([formData]);

    if (error) {
      console.error('Error inserting trade:', error);
    } else {
      console.log('Trade inserted:', data);
      if (onSuccess) onSuccess();
      // Reset form
      setFormData({
        pair: PAIRS[0],
        result: 'win',
        trade_type: 'buy',
        direction: DIRECTIONS[0],
        dp: false,
        entry_type: ENTRIES[0],
        rr: '',
        timeframe: TIMEFRAMES[0],
        open_date: '',
        closure_date: '',
        url: '',
        comments: '',
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Add New Trade</Typography>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Trade Basics */}
            <Grid item xs={12}>
              <Typography variant="h6">Trade Details</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Currency Pair</InputLabel>
                <Select
                  name="pair"
                  value={formData.pair}
                  onChange={handleChange}
                  label="Currency Pair"
                  required
                >
                  {PAIRS.map(pair => (
                    <MenuItem key={pair} value={pair}>
                      {pair}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Win/Loss</InputLabel>
                <Select
                  name="result"
                  value={formData.result}
                  onChange={handleChange}
                  label="Result"
                >
                  <MenuItem value="Win">Win</MenuItem>
                  <MenuItem value="Loss">Loss</MenuItem>
                  <MenuItem value="BE">BE</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Trade Type & Direction */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Trade Type</InputLabel>
                <Select
                  name="trade_type"
                  value={formData.trade_type}
                  onChange={handleChange}
                  label="Trade Type"
                >
                  <MenuItem value="Buy">Buy</MenuItem>
                  <MenuItem value="Sell">Sell</MenuItem>
                  
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Direction</InputLabel>
                <Select
                  name="direction"
                  value={formData.direction}
                  onChange={handleChange}
                  label="Direction"
                >
                  {DIRECTIONS.map(direction => (
                    <MenuItem key={direction} value={direction}>
                      {direction}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="dp"
                    checked={formData.dp}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Discount/Premium"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Entry Type</InputLabel>
                <Select
                  name="entry_type"
                  value={formData.entry_type}
                  onChange={handleChange}
                  label="Entry Type"
                >
                  {ENTRIES.map(entry => (
                    <MenuItem key={entry} value={entry}>
                      {entry}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Risk Management */}
            <Grid item xs={12}>
              <Typography variant="h6">Risk Management</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Risk/Reward Ratio"
                name="rr"
                type="number"
                inputProps={{ step: "0.1" }}
                value={formData.rr}
                onChange={handleChange}
              />
            </Grid>

            {/* Timing */}
            <Grid item xs={12}>
              <Typography variant="h6">Timing</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Open Date & Time"
                type="datetime-local"
                name="open_date"
                value={formData.open_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Closure Date & Time"
                type="datetime-local"
                name="closure_date"
                value={formData.closure_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Additional Info */}
            <Grid item xs={12}>
              <Typography variant="h6">Additional Information</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Screenshot URL"
                name="url"
                value={formData.url}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Timeframe</InputLabel>
                <Select
                  name="timeframe"
                  value={formData.timeframe}
                  onChange={handleChange}
                  label="Timeframe"
                >
                  {TIMEFRAMES.map(tf => (
                    <MenuItem key={tf} value={tf}>
                      {tf}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary" size="large">
                Add Trade
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default TradeForm;
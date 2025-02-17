import React, { useState } from 'react';
import { supabase } from './supabaseClient';

const TradeForm = () => {
  const [formData, setFormData] = useState({
    pair: '',
    win_or_loss: '',
    trade_type: '',
    direction: '',
    dp: false,
    entry_type: '',
    rr: '',
    timeframe: '',
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
      // Handle success (e.g., clear the form, show a success message)
      setFormData({
        pair: '',
        win_or_loss: '',
        trade_type: '',
        direction: '',
        dp: false,
        entry_type: '',
        rr: '',
        timeframe: '',
        open_date: '',
        closure_date: '',
        url: '',
        comments: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Pair:
        <input
          type="text"
          value={formData.pair}
          onChange={(e) => setFormData({ ...formData, pair: e.target.value })}
        />
      </label>

      <label>
        Win or Loss:
        <input
          type="text"
          value={formData.win_or_loss}
          onChange={(e) => setFormData({ ...formData, win_or_loss: e.target.value })}
        />
      </label>

      <label>
        Risk to Reward:
        <input
          type="number"
          step="0.1"
          value={formData.rr}
          onChange={(e) => setFormData({ ...formData, rr: e.target.value })}
        />
      </label>

      {/* Add inputs for other fields as needed */}

      <button type="submit">Add Trade</button>
    </form>
  );
};

export default TradeForm;

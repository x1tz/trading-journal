import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Dashboard';
import TradeForm from './TradeForm';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add-trade" element={<TradeForm />} />
      </Routes>
    </Router>
  );
};

export default App;

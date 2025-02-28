import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TopNavigation from './components/TopNavigation';
import Dashboard from './Dashboard';
import Calendar from './Calendar';
import News from './News';
import './styles/scrollbar.css';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    // Apply class to document element for global dark mode
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Toggle dark mode and save to localStorage
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
    
    // Apply class to document element for global dark mode
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <TopNavigation darkMode={darkMode} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Dashboard darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/calendar" element={<Calendar darkMode={darkMode} />} />
            <Route path="/news" element={<News darkMode={darkMode} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
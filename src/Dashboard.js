import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';
import TradesTable from './components/TradesTable';
import ResultsChart from './components/ResultsChart';
import CalendarView from './components/CalendarView';
import { BarChart2, TrendingUp, Percent } from 'lucide-react';

const Dashboard = ({ darkMode, toggleDarkMode }) => {
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
    const resultCounts = trades.reduce((acc, trade) => {
      acc[trade.result] = (acc[trade.result] || 0) + 1;
      return acc;
    }, {});

    const chartData = ['Win', 'Loss', 'BE'].map(result => ({
      name: result,
      value: resultCounts[result] || 0
    }));

    const winningTrades = trades.filter(t => t.result === 'Win').length;
    const winRate = totalTrades > 0 
      ? ((winningTrades / totalTrades) * 100).toFixed(1)
      : 0;

    const totalRR = trades.reduce((sum, trade) => sum + (parseFloat(trade.rr) || 0), 0).toFixed(1);
    //const avgRR = trades.length > 0 ? (totalRR / trades.length).toFixed(2) : 0;

    return { totalTrades, winRate, totalRR, chartData };
  };

  
  const stats = calculateStats();

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-4 right-4 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg z-50"
      >
        {darkMode ? '🌞' : '🌙'}
      </button>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {loading ? (
          Array(4).fill().map((_, i) => (
            <div 
              key={i} 
              className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-20"
            />
          ))
        ) : (
          <>
            {/* Total Trades Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg mr-3">
                  <BarChart2 className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                    Total Trades
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {stats.totalTrades}
                  </div>
                </div>
              </div>
            </div>

            {/* Win Rate Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg mr-3">
                  <Percent className="text-green-600 dark:text-green-400" size={20} />
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                    Win Rate
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {stats.winRate}%
                  </div>
                </div>
              </div>
            </div>

            {/* Total R:R Card */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md">
              <div className="flex items-center">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-lg mr-3">
                  <TrendingUp className="text-purple-600 dark:text-purple-400" size={20} />
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs font-medium">
                    Total R:R
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {stats.totalRR}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-48">
              <ResultsChart data={stats.chartData} darkMode={darkMode} />
            </div>
          </>
        )}
      </div>
      

      {/* Table Section */}
      {loading ? (
        <div className="animate-pulse bg-gray-100 dark:bg-gray-700 h-64" />
      ) : (
        <TradesTable trades={trades} refreshTrades={fetchTrades} darkMode={darkMode} />
      )}
        
      {/* Add margin between table and calendar */}
      <div className="mb-8"></div>

      {/* Add Calendar View Section Here */}
      {/*<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">*/}
        
        {loading ? (
          <div className="animate-pulse bg-gray-100 dark:bg-gray-700 h-64 rounded-xl" />
        ) : (
          <CalendarView trades={trades} darkMode={darkMode} />
        )}
      </div>
  );
};

export default Dashboard;
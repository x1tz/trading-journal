import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';
import TradesTable from './components/TradesTable';
import ResultsChart from './components/ResultsChart';
import CalendarView from './components/CalendarView';
import { BarChart2, TrendingUp, Percent } from 'lucide-react';

// Flexible Stat Card Component
const StatCard = ({ icon: Icon, iconColor, iconBgColor, label, value, valueColor }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md flex items-center p-4 h-20 w-40">
    <div className={`${iconBgColor} p-1 rounded-lg mr-2 flex items-center justify-center`}>
      <Icon className={iconColor} size={24} />
    </div>
    <div>
      <div className="text-gray-500 dark:text-gray-400 text-xs leading-none mb-0.5">
        {label}
      </div>
      <div className={`text-xl font-bold ${valueColor} leading-tight`}>
        {value}
      </div>
    </div>
  </div>
);

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

      {/* Flexible Stats Section */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-3">
          {loading ? (
            <>
              <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-10 w-36" />
              <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-10 w-36" />
              <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-10 w-36" />
              <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-40 w-full md:w-48 mt-3" />
            </>
          ) : (
            <>
              <div className="flex flex-wrap gap-3 items-start">
                {/* Stat cards wrapper */}
                <div className="flex flex-wrap gap-3">
                  <StatCard
                    icon={BarChart2}
                    iconColor="text-blue-600 dark:text-blue-400"
                    iconBgColor="bg-blue-100 dark:bg-blue-900"
                    label="Total Trades"
                    value={stats.totalTrades}
                    valueColor="text-blue-600 dark:text-blue-400"
                  />
                  
                  <StatCard
                    icon={Percent}
                    iconColor="text-green-600 dark:text-green-400"
                    iconBgColor="bg-green-100 dark:bg-green-900"
                    label="Win Rate"
                    value={`${stats.winRate}%`}
                    valueColor="text-green-600 dark:text-green-400"
                  />
                  
                  <StatCard
                    icon={TrendingUp}
                    iconColor="text-purple-600 dark:text-purple-400"
                    iconBgColor="bg-purple-100 dark:bg-purple-900"
                    label="Total R:R"
                    value={stats.totalRR}
                    valueColor="text-purple-600 dark:text-purple-400"
                  />
                </div>
                
                {/* Chart */}
                <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-40 w-full md:w-64 flex-shrink-0 mt-3 md:mt-0">
                  <ResultsChart data={stats.chartData} darkMode={darkMode} />
                </div>
              </div>
            </>
          )}
        </div>
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
      {loading ? (
        <div className="animate-pulse bg-gray-100 dark:bg-gray-700 h-64 rounded-xl" />
      ) : (
        <CalendarView trades={trades} darkMode={darkMode} />
      )}
    </div>
  );
};

export default Dashboard;
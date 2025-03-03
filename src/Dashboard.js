import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';
import TradesTable from './components/TradesTable';
import ResultsChart from './components/ResultsChart';
import RRProgressionChart from './components/RRProgressionChart';
import CalendarView from './components/CalendarView';
import { BarChart2, TrendingUp, Percent, DollarSign } from 'lucide-react';

// Improved Stat Card Component
const StatCard = ({ icon: Icon, iconColor, iconBgColor, label, value, valueColor }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md flex items-center p-4 h-24 w-full">
    <div className={`${iconBgColor} p-2 rounded-lg mr-3 flex items-center justify-center`}>
      <Icon className={iconColor} size={28} />
    </div>
    <div>
      <div className="text-gray-500 dark:text-gray-400 text-sm leading-none mb-1">
        {label}
      </div>
      <div className={`text-2xl font-bold ${valueColor} leading-tight`}>
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
    
    // Calculate Profit Factor (total profit / total loss)
    let totalProfit = 0;
    let totalLoss = 0;
    
    trades.forEach(trade => {
      const rr = parseFloat(trade.rr) || 0;
      if (rr > 0) {
        totalProfit += rr;
      } else if (rr < 0) {
        totalLoss -= rr; // Convert to positive for the calculation
      }
    });
    
    const profitFactor = totalLoss > 0 
      ? (totalProfit / totalLoss).toFixed(2)
      : totalProfit > 0 ? 'Inf' : '0.00';

    return { totalTrades, winRate, totalRR, chartData, profitFactor };
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

      {/* Stats Section - Four StatCards with full width */}
      <div className="mb-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-24 w-full" />
            <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-24 w-full" />
            <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-24 w-full" />
            <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-24 w-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 w-full">
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
            
            <StatCard
              icon={DollarSign}
              iconColor="text-amber-600 dark:text-amber-400"
              iconBgColor="bg-amber-100 dark:bg-amber-900"
              label="Profit Factor"
              value={stats.profitFactor}
              valueColor="text-amber-600 dark:text-amber-400"
            />
          </div>
        )}
        
        {/* Dual Chart Section - Line Chart and Results Chart side by side */}
        {loading ? (
          <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl h-64 w-full mb-8" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Line Chart - Takes 2/3 of the width */}
            <div className="md:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-96">
              <RRProgressionChart trades={trades} darkMode={darkMode} />
            </div>
            
            {/* Results Chart - Takes 1/3 of the width */}
            <div className="md:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-96">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trade Results</h3>
              <ResultsChart data={stats.chartData} darkMode={darkMode} />
            </div>
          </div>
        )}
      </div>
      
      {/* Table Section */}
      <div className="mb-8">
        {loading ? (
          <div className="animate-pulse bg-gray-100 dark:bg-gray-700 h-64 rounded-xl" />
        ) : (
          <TradesTable trades={trades} refreshTrades={fetchTrades} darkMode={darkMode} />
        )}
      </div>
      
      {/* Calendar View Section */}
      {loading ? (
        <div className="animate-pulse bg-gray-100 dark:bg-gray-700 h-64 rounded-xl" />
      ) : (
        <CalendarView trades={trades} darkMode={darkMode} />
      )}
    </div>
  );
};

export default Dashboard;
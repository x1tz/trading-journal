import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const RRProgressionChart = ({ trades, darkMode }) => {
  const [timeframe, setTimeframe] = useState('all');
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  // Process trades to calculate cumulative RR over time
  const processTradeData = useCallback((tradesToProcess) => {
    if (!tradesToProcess || tradesToProcess.length === 0) {
      return [];
    }
    
    // Sort trades by date (oldest first)
    const sortedTrades = [...tradesToProcess].sort((a, b) => 
      new Date(a.open_date) - new Date(b.open_date)
    );
    
    // Get distinct months for X-axis labeling
    const allDates = sortedTrades.map(trade => new Date(trade.open_date));
    const monthsMap = new Map();
    
    allDates.forEach(date => {
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthsMap.has(key)) {
        monthsMap.set(key, {
          date,
          month: date.getMonth(),
          year: date.getFullYear()
        });
      }
    });
    
    // Array of month markers
    const monthMarkers = Array.from(monthsMap.values());
    
    // Calculate cumulative RR
    let cumulativeRR = 0;
    const chartData = sortedTrades.map(trade => {
      cumulativeRR += parseFloat(trade.rr) || 0;
      
      const date = new Date(trade.open_date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      
      // Check if this is the first trade of the month
      const isMonthStart = monthsMap.get(monthKey).date.getTime() === date.getTime();
      
      // Format month name
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthName = monthNames[date.getMonth()];
      
      // Create label with year if it's January or the first month in the dataset
      let displayLabel = '';
      if (isMonthStart) {
        if (date.getMonth() === 0 || monthMarkers.findIndex(m => m.date.getTime() === date.getTime()) === 0) {
          displayLabel = `${monthName} '${date.getFullYear().toString().slice(-2)}`;
        } else {
          displayLabel = monthName;
        }
      }
      
      return {
        date: date.toISOString(),
        displayDate: `${monthName} ${date.getDate()}`,
        displayLabel,
        fullDate: trade.open_date,
        cumulativeRR: parseFloat(cumulativeRR.toFixed(2)),
        tradeRR: parseFloat(trade.rr) || 0
      };
    });
    
    return chartData;
  }, []);

  // Filter trades based on selected timeframe
  const filterTradesByTimeframe = useCallback(() => {
    const currentDate = new Date();
    let filteredTrades = [];

    switch (timeframe) {
      case 'week':
        // Get trades from last 7 days
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        filteredTrades = trades.filter(trade => 
          new Date(trade.open_date) >= weekAgo
        );
        break;
      
      case 'month':
        // Get trades from current month
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        filteredTrades = trades.filter(trade => 
          new Date(trade.open_date) >= firstDayOfMonth
        );
        break;

      case 'year':
        // Get trades from current year
        const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
        filteredTrades = trades.filter(trade => 
          new Date(trade.open_date) >= firstDayOfYear
        );
        break;

      case 'lastyear':
        // Get trades from last year
        const firstDayLastYear = new Date(currentDate.getFullYear() - 1, 0, 1);
        const lastDayLastYear = new Date(currentDate.getFullYear() - 1, 11, 31);
        filteredTrades = trades.filter(trade => {
          const tradeDate = new Date(trade.open_date);
          return tradeDate >= firstDayLastYear && tradeDate <= lastDayLastYear;
        });
        break;

      case 'custom':
        // Custom date range
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          // Set end date to end of day
          end.setHours(23, 59, 59, 999);
          
          filteredTrades = trades.filter(trade => {
            const tradeDate = new Date(trade.open_date);
            return tradeDate >= start && tradeDate <= end;
          });
        } else {
          filteredTrades = trades;
        }
        break;
        
      case 'all':
      default:
        filteredTrades = trades;
    }

    return filteredTrades;
  }, [timeframe, startDate, endDate, trades]);

  // Update filtered data when timeframe changes
  useEffect(() => {
    const filtered = filterTradesByTimeframe();
    setFilteredData(processTradeData(filtered));
    
    setShowCustomDatePicker(timeframe === 'custom');
  }, [timeframe, startDate, endDate, trades, filterTradesByTimeframe, processTradeData]);

  // Handle timeframe change
  const handleTimeframeChange = (e) => {
    setTimeframe(e.target.value);
  };

  // Custom tooltip to show more details
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={`p-2 rounded shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
          <p className="text-sm font-medium">{new Date(data.fullDate).toLocaleDateString()}</p>
          <p className="text-sm">Trade R:R: {data.tradeRR.toFixed(2)}</p>
          <p className="text-sm font-bold">Total R:R: {data.cumulativeRR.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Overview
        </h3>
      </div>
      
      {/* Chart container with proper centering */}
      <div className="flex-grow mb-4 flex justify-center items-center">
        {filteredData.length > 0 ? (
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%" minHeight={200}>
              <LineChart 
                data={filteredData} 
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <XAxis 
                  dataKey="displayLabel" 
                  tick={{ fontSize: 10 }}
                  stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                  tickLine={darkMode ? { stroke: '#4B5563' } : undefined}
                  height={30}
                  padding={{ left: 10, right: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 10 }} 
                  stroke={darkMode ? "#9CA3AF" : "#6B7280"}
                  tickLine={darkMode ? { stroke: '#4B5563' } : undefined}
                  width={30}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeRR" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, stroke: '#8884d8', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full text-gray-500 dark:text-gray-400">
            No trade data available for the selected timeframe
          </div>
        )}
      </div>
      
      {/* Time selection controls moved below chart */}
      <div className={`flex flex-wrap justify-between items-center gap-2 mt-auto ${
        darkMode ? 'text-gray-200' : 'text-gray-700'
      }`}>
        <select 
          value={timeframe}
          onChange={handleTimeframeChange}
          className={`text-xs rounded border px-2 py-1 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-200' 
              : 'bg-white border-gray-300 text-gray-700'
          }`}
        >
          <option value="all">All Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="lastyear">Last Year</option>
          <option value="custom">Custom Range</option>
        </select>
        
        {/* Custom date picker inline with dropdown */}
        {showCustomDatePicker && (
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center space-x-1">
              <label className="text-xs whitespace-nowrap">From:</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className={`text-xs p-1 rounded border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              />
            </div>
            <div className="flex items-center space-x-1">
              <label className="text-xs whitespace-nowrap">To:</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className={`text-xs p-1 rounded border ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200' 
                    : 'bg-white border-gray-300 text-gray-700'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RRProgressionChart;
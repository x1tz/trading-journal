import React, { useState } from 'react';
import TradeForm from './TradeForm';

const TradesTable = ({ trades, refreshTrades, darkMode }) => {
  const [open, setOpen] = useState(false);

  // Result badge color mapping
  const resultColors = {
    Win: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-300'
    },
    Loss: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-300'
    },
    BE: {
      bg: 'bg-gray-100 dark:bg-gray-700/50',
      text: 'text-gray-700 dark:text-gray-300'
    }
  };

  return (
    <div>
      {/* Button positioned outside the table container */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center space-x-2"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Add Trade</span>
        </button>
      </div>

      {/* Table Container - without the top margin */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-800 dark:bg-gray-700">
              <tr>
                {['Pair', 'Direction', 'Result', 'Risk/Reward', 'Open Date', 'Close Date'].map((header) => (
                  <th 
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {trades.map((trade, index) => (
                <tr 
                  key={trade.id} 
                  className={`${
                    index % 2 === 0 
                      ? 'bg-white dark:bg-gray-800' 
                      : 'bg-gray-50 dark:bg-gray-700/30'
                  } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                    {trade.pair}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {trade.direction}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      resultColors[trade.result]?.bg || 'bg-gray-100 dark:bg-gray-700'
                    } ${
                      resultColors[trade.result]?.text || 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {trade.result?.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {trade.rr}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(trade.open_date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {trade.closure_date ? 
                      new Date(trade.closure_date).toLocaleString() : 
                      <span className="font-medium text-gray-900 dark:text-gray-100">Open</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog for adding new trade */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <TradeForm 
                onSuccess={() => {
                  setOpen(false);
                  refreshTrades();
                }}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradesTable;
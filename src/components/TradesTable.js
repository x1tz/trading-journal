import React, { useState } from 'react';
import TradeForm from './TradeForm';
import supabase from '../supabaseClient'; // Make sure the path is correct

const TradesTable = ({ trades, refreshTrades, darkMode }) => {
  const [open, setOpen] = useState(false);
  const [editTrade, setEditTrade] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const rowsPerPage = 10;

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

  // Calculate pagination values
  const totalPages = Math.ceil(trades.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentTrades = trades.slice(indexOfFirstRow, indexOfLastRow);

  // Handle page navigation
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setSelectedRow(null);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setSelectedRow(null);
    }
  };

  // Handle edit trade
  const handleEditTrade = (trade) => {
    setEditTrade(trade);
    setOpen(true);
  };

  // Handle delete trade
  const handleDeleteTrade = async (id) => {
    if (window.confirm('Are you sure you want to delete this trade?')) {
      try {
        const { error } = await supabase
          .from('trades')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        
        // Refresh trades after successful deletion
        refreshTrades();
        setSelectedRow(null);
      } catch (error) {
        console.error('Error deleting trade:', error.message);
        alert('Failed to delete trade. Please try again.');
      }
    }
  };

  // Handle row click/selection
  const handleRowClick = (id) => {
    setSelectedRow(selectedRow === id ? null : id);
  };

  // Handle image preview
  const handleImagePreview = (url) => {
    if (!url) return;
    window.open(url, '_blank');
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength = 30) => {
    if (!text) return '';
    return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  return (
    <div>
      {/* Button positioned outside the table container */}
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => {
            setEditTrade(null); // Ensure we're creating a new trade, not editing
            setOpen(true);
          }}
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

      {/* Table Container */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-800 dark:bg-gray-700">
              <tr>
                {[
                  'Pair',
                  'Direction',
                  'Result',
                  'Trade Type',
                  'D/P',
                  'Entry Type',
                  'Risk/Reward',
                  'Timeframe',
                  'Open Date',
                  'Close Date',
                  'Before Image',
                  'After Image',
                  'Comments'
                ].map((header) => (
                  <th 
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentTrades.map((trade, index) => (
                <tr 
                  key={trade.id}
                  onClick={() => handleRowClick(trade.id)}
                  className={`
                    ${index % 2 === 0 
                      ? 'bg-white dark:bg-gray-800' 
                      : 'bg-gray-50 dark:bg-gray-700/30'
                    } 
                    ${selectedRow === trade.id ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                    transition-colors cursor-pointer relative
                  `}
                >
                  {/* Pair */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                    {trade.pair}
                  </td>
                  
                  {/* Direction */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      trade.direction === 'Long' 
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' 
                        : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    }`}>
                      {trade.direction}
                    </span>
                  </td>
                  
                  {/* Result */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      resultColors[trade.result]?.bg || 'bg-gray-100 dark:bg-gray-700'
                    } ${
                      resultColors[trade.result]?.text || 'text-gray-800 dark:text-gray-200'
                    }`}>
                      {trade.result?.toUpperCase()}
                    </span>
                  </td>
                  
                  {/* Trade Type */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {trade.trade_type || '-'}
                  </td>
                  
                  {/* Discount/Premium */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {trade.dp ? '✅' : '❌'}
                  </td>
                  
                  {/* Entry Type */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {trade.entry_type || '-'}
                  </td>
                  
                  {/* Risk/Reward */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {trade.rr || '-'}
                  </td>
                  
                  {/* Timeframe */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {trade.timeframe || '-'}
                  </td>
                  
                  {/* Open Date */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {trade.open_date ? new Date(trade.open_date).toLocaleString() : '-'}
                  </td>
                  
                  {/* Close Date */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {trade.closure_date ? 
                      new Date(trade.closure_date).toLocaleString() : 
                      <span className="font-medium text-gray-900 dark:text-gray-100">Open</span>
                    }
                  </td>
                  
                  {/* Before Image */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {trade.image_before ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImagePreview(trade.image_before);
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View Image
                      </button>
                    ) : '-'}
                  </td>
                  
                  {/* After Image */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                    {trade.image_after ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImagePreview(trade.image_after);
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View Image
                      </button>
                    ) : '-'}
                  </td>
                  
                  {/* Comments */}
                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-200 max-w-xs">
                    <div className="truncate">
                      {trade.comments ? truncateText(trade.comments, 50) : '-'}
                    </div>
                  </td>

                  {/* Action buttons that only appear when row is selected */}
                  {selectedRow === trade.id && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditTrade(trade);
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors p-1 bg-white dark:bg-gray-700 rounded-full shadow"
                        title="Edit"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTrade(trade.id);
                        }}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1 bg-white dark:bg-gray-700 rounded-full shadow"
                        title="Delete"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  currentPage === 1 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Previous
              </button>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500' 
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastRow, trades.length)}
                  </span>{' '}
                  of <span className="font-medium">{trades.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 ${
                      currentPage === 1 
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500' 
                        : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Current page indicator */}
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200">
                    Page {currentPage} of {totalPages}
                  </span>
                  
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 ${
                      currentPage === totalPages 
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500' 
                        : 'bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Dialog for adding/editing trade */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => {
                  setOpen(false);
                  setEditTrade(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                {editTrade ? 'Edit Trade' : 'Add New Trade'}
              </h2>
              <TradeForm 
                trade={editTrade}
                onSuccess={() => {
                  setOpen(false);
                  setEditTrade(null);
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
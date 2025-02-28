import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { data } from 'react-router-dom';

const CalendarView = ({ trades }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Process trades data to create the tradeData structure
  const tradeData = trades.reduce((acc, trade) => {
    if (trade.open_date) {
      const dateKey = format(new Date(trade.open_date), 'yyyy-MM-dd');
      acc[dateKey] = {
        profit: trade.rr // Adjust based on your data structure
      };
    }
    return acc;
  }, {});

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Generate calendar grid
  const calendarGrid = () => {
    const grid = [];
    const startDay = startOfMonth(currentDate).getDay();
    
    // Add empty cells for days before month start
    for (let i = 0; i < startDay; i++) {
      grid.push(<div key={`empty-${i}`} className="px-3 py-2"></div>);
    }

    // Add actual days of the month
    daysInMonth.forEach((date) => {
      const dateKey = format(date, 'yyyy-MM-dd');
      const hasTrade = dateKey in tradeData;
      const profit = hasTrade ? tradeData[dateKey].profit : 0;
      
      // Determine background and text color based on profit
      let bgColorClass = 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700';
      let textColorClass = 'text-gray-500 group-hover:text-gray-700 dark:text-slate-200 dark:group-hover:text-white';
      
      if (hasTrade) {
        if (profit > 0) {
          bgColorClass = 'bg-green-100 hover:bg-blue-600 dark:bg-green-800';
          textColorClass = 'text-green-500 group-hover:text-white dark:text-green-300';
        } else if (profit < 0) {
          bgColorClass = 'bg-red-100 hover:bg-blue-600 dark:bg-red-800';
          textColorClass = 'text-red-500 group-hover:text-white dark:text-red-300';
        }
      }
      
      grid.push(
        <div
          key={dateKey}
          className={`group m-1 flex cursor-pointer flex-col items-end justify-between rounded-md px-3 py-2 ${bgColorClass}`}
        >
          <span className={`font-bold ${textColorClass}`}>
            {format(date, 'd')}
          </span>
          {hasTrade && (
            <span className={`hidden text-xs font-light md:block ${textColorClass}`}>
              {tradeData[dateKey].profit} R
            </span>
          )}
        </div>
      );
    });

    return grid;
  };

  return (
    <div className="col-span-2 rounded-2xl bg-white px-5 py-5 dark:bg-gray-900">
      <div className="mb-5 flex items-center justify-between">
        <div className="text-center text-lg font-medium text-gray-500 dark:text-slate-200">
          {format(currentDate, 'MMMM yyyy')}
        </div>
        <div className="inline-flex" role="group">
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="group flex items-center justify-center rounded-lg rounded-r-none border border-gray-200 bg-white p-0.5 text-center font-medium text-gray-900 enabled:hover:bg-gray-100 enabled:hover:text-cyan-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-slate-200 dark:enabled:hover:bg-gray-700 dark:enabled:hover:text-white"
          >
            <span className="flex items-center rounded-md rounded-r-none px-4 py-2 text-sm transition-all duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="group flex items-center justify-center rounded-lg rounded-l-none border-l-0 border-gray-200 bg-white p-0.5 pl-0 text-center font-medium text-gray-900 enabled:hover:bg-gray-100 enabled:hover:text-cyan-700 focus:z-10 focus:outline-none focus:ring-2 focus:ring-cyan-700 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-slate-200 dark:enabled:hover:bg-gray-700 dark:enabled:hover:text-white"
          >
            <span className="flex items-center rounded-md rounded-l-none px-4 py-2 text-sm transition-all duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 rounded-xl">
        {/* Weekday headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="px-3 py-2 text-left font-bold text-gray-500 dark:text-slate-200">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {calendarGrid()}
      </div>
    </div>
  );
};

export default CalendarView;
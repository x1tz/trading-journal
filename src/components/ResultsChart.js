import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ResultsChart = ({ data, darkMode }) => {
  // Define colors for both modes
  const colors = {
    light: {
      Win: '#4CAF50',    // Green
      Loss: '#F44336',   // Red
      BE: '#9E9E9E',     // Grey
      stroke: '#ffffff'  // Cell stroke
    },
    dark: {
      Win: '#66BB6A',    // Brighter green
      Loss: '#EF5350',   // Brighter red
      BE: '#BDBDBD',     // Brighter grey
      stroke: '#1F2937'  // Dark stroke
    }
  };

  const mode = darkMode ? 'dark' : 'light';
  
  // Custom tooltip component using Tailwind
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 text-sm">
          <p className="text-gray-700 dark:text-gray-200 font-medium">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  // Custom legend component using Tailwind
  const CustomLegend = (props) => {
    const { payload } = props;
    
    return (
      <ul className="flex flex-col gap-2 text-sm">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-700 dark:text-gray-200">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[mode][entry.name]} 
                stroke={colors[mode].stroke}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            content={<CustomLegend />}
            layout="vertical" 
            align="right" 
            verticalAlign="middle"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResultsChart;
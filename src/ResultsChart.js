import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ResultsChart = ({ data, darkMode }) => {
  // Define colors for both modes
  const colors = {
    light: {
      Win: '#4CAF50',    // Green
      Loss: '#F44336',   // Red
      BE: '#9E9E9E',     // Grey
      text: '#616161',   // Legend text
      background: '#fff',// Tooltip background
      stroke: '#ffffff'  // Cell stroke
    },
    dark: {
      Win: '#66BB6A',    // Brighter green
      Loss: '#EF5350',   // Brighter red
      BE: '#BDBDBD',     // Brighter grey
      text: '#E0E0E0',   // Light text
      background: '#374151', // Dark background
      stroke: '#1F2937'  // Dark stroke
    }
  };

  const mode = darkMode ? 'dark' : 'light';
  
  return (
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
        <Tooltip 
          contentStyle={{
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            backgroundColor: colors[mode].background,
            borderColor: darkMode ? '#4B5563' : '#E5E7EB'
          }}
          itemStyle={{ color: colors[mode].text }}
        />
        <Legend 
          layout="vertical" 
          align="right" 
          verticalAlign="middle"
          formatter={(value) => (
            <span style={{ color: colors[mode].text }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ResultsChart;
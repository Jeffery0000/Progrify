import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { DailyStats } from '../types';

interface ProductivityGraphProps {
  data: DailyStats[];
}

const ProductivityGraph: React.FC<ProductivityGraphProps> = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm h-80">
      <h2 className="text-lg font-medium text-gray-800 mb-4">Weekly Productivity Pattern</h2>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="dayName"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => value.substring(0, 3)}
          />
          <YAxis
            tickFormatter={(value) => value.toFixed(1)}
            domain={[0, 'dataMax + 1']}
            tick={{ fontSize: 12 }}
            label={{ value: 'Average Points', angle: -90, position: 'insideLeft', fontSize: 11, style: { textAnchor: 'middle' } }}
          />
          <Tooltip
            formatter={(value: number) => [`${value.toFixed(1)} points`, 'Daily Average']}
            labelFormatter={(label) => `${label}`}
            contentStyle={{
              borderRadius: '6px',
              border: 'none',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="averagePoints"
            name="Daily Average Points"
            stroke="#0D9488"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductivityGraph;
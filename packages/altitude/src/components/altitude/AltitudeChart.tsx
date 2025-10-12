import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { AltitudeComparisonItem } from './types';

interface AltitudeChartProps {
  data: AltitudeComparisonItem[];
  sortedBy: 'asc' | 'desc';
}

const AltitudeChart: React.FC<AltitudeChartProps> = ({ data, sortedBy }) => {
  // 准备图表数据
  const chartData = [...data].sort((a, b) => 
    sortedBy === 'asc' ? a.altitude - b.altitude : b.altitude - a.altitude
  );

  // 自定义tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-cyan-600 font-bold">{data.altitude} 米</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px] bg-white rounded-lg overflow-hidden">
      {!data.length ? (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          暂无数据
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value}m`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="altitude" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.isUserLocation ? '#0ea5e9' : '#10b981'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AltitudeChart;
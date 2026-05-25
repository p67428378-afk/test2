import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CustomBarChart = ({ data, xAxisKey, dataKey, title }) => {
  return (
    <div className='bg-white p-4 rounded-lg shadow-md'>
      <h3 className='text-lg font-semibold mb-4'>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill="#2196F3" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const SimpleLineChart = ({ data, xAxisKey, dataKey, title }) => {
  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
        <h3 className='text-lg font-semibold mb-4'>{title}</h3>
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={xAxisKey} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey={dataKey} stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    </div>
  );
};

export default SimpleLineChart;

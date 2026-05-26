import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EngagementChart = ({ data }) => {
  return (
    <section className='bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden'>
      <div className='p-lg flex justify-between items-center border-b border-surface-variant'>
        <div>
          <h2 className='font-headline-md text-headline-md text-on-surface'>Real-time Engagement Metrics</h2>
          <p className='text-outline font-label-md text-label-md'>Last 24h tracked across all channels</p>
        </div>
      </div>
      <div className='h-80 w-full p-xl relative'>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="likes" stroke="#3525cd" strokeWidth={3} />
            <Line type="monotone" dataKey="comments" stroke="#006c49" strokeWidth={2.5} />
            <Line type="monotone" dataKey="shares" stroke="#684000" strokeWidth={2} strokeDasharray="4" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default EngagementChart;

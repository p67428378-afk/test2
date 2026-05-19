import React, { useState, useEffect } from 'react';
import { getDailyRevenueReport } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RevenueReport = () => {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await getDailyRevenueReport();
        setReport(response.data);
      } catch (err) {
        setError('Failed to fetch revenue report.');
        console.error(err);
      }
    };

    fetchReport();
  }, []);

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  if (!report) {
    return <div>Loading...</div>;
  }

  const data = Object.keys(report.revenueBreakdown).map(key => ({
    name: key,
    revenue: report.revenueBreakdown[key],
  }));

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Daily Revenue Report for {new Date(report.date).toLocaleDateString()}</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold'>Total Revenue</h3>
          <p className='text-3xl'>${report.totalRevenue}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold'>Pending Dues</h3>
          <p className='text-3xl'>${report.pendingDues}</p>
        </div>
      </div>
      <div className='bg-white p-4 rounded-lg shadow'>
        <h3 className='text-lg font-semibold mb-4'>Revenue Breakdown</h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='revenue' fill='#8884d8' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueReport;

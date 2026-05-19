import React, { useState, useEffect } from 'react';
import { getDashboardSummary } from '../services/api';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await getDashboardSummary();
        setSummary(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard summary.');
        console.error(err);
      }
    };

    fetchSummary();
  }, []);

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  if (!summary) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Dashboard</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold'>Total Bookings</h3>
          <p className='text-3xl'>{summary.totalBookings}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold'>Available Rooms</h3>
          <p className='text-3xl'>{summary.availableRooms}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold'>Today's Revenue</h3>
          <p className='text-3xl'>${summary.todaysRevenue}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow'>
          <h3 className='text-lg font-semibold'>Recent Activities</h3>
          <ul>
            {summary.recentActivities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import { getExpiryAlerts } from '../services/api';
import Card from '../components/common/Card';

const ExpiryManagement = () => {
  const [expiryAlerts, setExpiryAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getExpiryAlerts()
      .then(response => {
        setExpiryAlerts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch expiry alerts');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card>
      <h2 className='font-h2 text-h2 text-primary mb-4'>Expiry Management</h2>
      <table className='w-full text-left'>
        <thead>
          <tr className='border-b border-outline-variant'>
            <th className='p-4'>Name</th>
            <th className='p-4'>Quantity</th>
            <th className='p-4'>Location</th>
            <th className='p-4'>Expiry Date</th>
            <th className='p-4'>Alert Status</th>
          </tr>
        </thead>
        <tbody>
          {expiryAlerts.map(item => (
            <tr key={item.id} className='border-b border-surface-container-highest'>
              <td className='p-4'>{item.snack_name}</td>
              <td className='p-4'>{item.quantity}</td>
              <td className='p-4'>{item.location}</td>
              <td className='p-4'>{new Date(item.expiry_date).toLocaleDateString()}</td>
              <td className='p-4'>{item.alert_status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default ExpiryManagement;

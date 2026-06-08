import React, { useState, useEffect } from 'react';
import { getInventory } from '../services/api';
import Card from '../components/common/Card';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getInventory()
      .then(response => {
        setInventory(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Failed to fetch inventory');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Card>
      <h2 className='font-h2 text-h2 text-primary mb-4'>Snack Inventory</h2>
      <table className='w-full text-left'>
        <thead>
          <tr className='border-b border-outline-variant'>
            <th className='p-4'>Name</th>
            <th className='p-4'>Quantity</th>
            <th className='p-4'>Location</th>
            <th className='p-4'>Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map(item => (
            <tr key={item.id} className='border-b border-surface-container-highest'>
              <td className='p-4'>{item.snack_name}</td>
              <td className='p-4'>{item.quantity}</td>
              <td className='p-4'>{item.location}</td>
              <td className='p-4'>{new Date(item.expiry_date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default Inventory;

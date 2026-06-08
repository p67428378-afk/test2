import React, { useState, useEffect } from 'react';
import { getInventory, consumeSnack } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';

const MarkConsumedForm = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    getInventory().then(response => setInventory(response.data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    consumeSnack(selectedItem, { quantity_consumed: parseInt(quantity) })
      .then(response => {
        setMessage('Snack consumed successfully!');
        setSelectedItem('');
        setQuantity('');
        // Refresh inventory
        getInventory().then(response => setInventory(response.data));
      })
      .catch(error => {
        setMessage('Failed to mark snack as consumed.');
      });
  };

  return (
    <Card>
      <h2 className='font-h2 text-h2 text-primary mb-4'>Mark Snack as Consumed</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='snack' className='block text-sm font-medium text-on-surface-variant'>Select Snack</label>
          <select
            id='snack'
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            required
          >
            <option value=''>Select a snack</option>
            {inventory.map(item => (
              <option key={item.id} value={item.id}>{item.snack_name} (Qty: {item.quantity})</option>
            ))}
          </select>
        </div>
        <div className='mb-4'>
          <label htmlFor='quantity' className='block text-sm font-medium text-on-surface-variant'>Quantity Consumed</label>
          <input
            type='number'
            id='quantity'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            required
          />
        </div>
        <Button type='submit'>Mark as Consumed</Button>
      </form>
      {message && <p className='mt-4'>{message}</p>}
    </Card>
  );
};

export default MarkConsumedForm;

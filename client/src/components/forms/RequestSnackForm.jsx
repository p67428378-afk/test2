import React, { useState } from 'react';
import { requestSnack } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';

const RequestSnackForm = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    requestSnack({ name, quantity: parseInt(quantity) })
      .then(response => {
        setMessage(`Request submitted successfully! Request ID: ${response.data.request_id}`)
        setName('');
        setQuantity('');
      })
      .catch(error => {
        setMessage('Failed to submit request.');
      });
  };

  return (
    <Card>
      <h2 className='font-h2 text-h2 text-primary mb-4'>Request New Snack</h2>
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='name' className='block text-sm font-medium text-on-surface-variant'>Snack Name</label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            required
          />
        </div>
        <div className='mb-4'>
          <label htmlFor='quantity' className='block text-sm font-medium text-on-surface-variant'>Quantity</label>
          <input
            type='number'
            id='quantity'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            required
          />
        </div>
        <Button type='submit'>Submit Request</Button>
      </form>
      {message && <p className='mt-4'>{message}</p>}
    </Card>
  );
};

export default RequestSnackForm;

import React, { useState } from 'react';
import { createOrder } from '../../services/api';

const OrderForm = ({ onOrderCreated }) => {
  const [instrumentId, setInstrumentId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [orderType, setOrderType] = useState('LIMIT');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const orderData = {
        instrument_id: instrumentId,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
        order_type: orderType,
      };
      const newOrder = await createOrder(orderData);
      onOrderCreated(newOrder);
      // Reset form
      setInstrumentId('');
      setQuantity('');
      setPrice('');
    } catch (err) {
      setError('Failed to create order. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-surface-container-lowest border border-outline-variant rounded-lg p-4 md:p-6 shadow-sm'>
      <h3 className='font-title-sm text-base text-on-surface mb-4'>Create New Order</h3>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor='instrumentId' className='block text-sm font-medium text-on-surface-variant mb-1'>Instrument ID</label>
          <input
            id='instrumentId'
            type='text'
            value={instrumentId}
            onChange={(e) => setInstrumentId(e.target.value)}
            className='w-full bg-surface border border-outline-variant rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary'
            required
          />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label htmlFor='quantity' className='block text-sm font-medium text-on-surface-variant mb-1'>Quantity</label>
            <input
              id='quantity'
              type='number'
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className='w-full bg-surface border border-outline-variant rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary'
              required
            />
          </div>
          <div>
            <label htmlFor='price' className='block text-sm font-medium text-on-surface-variant mb-1'>Price</label>
            <input
              id='price'
              type='number'
              step='0.01'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className='w-full bg-surface border border-outline-variant rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary'
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor='orderType' className='block text-sm font-medium text-on-surface-variant mb-1'>Order Type</label>
          <select
            id='orderType'
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className='w-full bg-surface border border-outline-variant rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary'
          >
            <option>LIMIT</option>
            <option>MARKET</option>
          </select>
        </div>
        {error && <p className='text-sm text-error'>{error}</p>}
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full bg-primary text-on-primary font-semibold py-2 px-4 rounded-md hover:bg-primary/90 disabled:bg-primary/50 transition-colors'
        >
          {isSubmitting ? 'Submitting...' : 'Submit Order'}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;

import React, { useState } from 'react';
import { createOrder } from '../../services/api';

const OrderForm = ({ onOrderCreated }) => {
  const [instrumentId, setInstrumentId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [orderType, setOrderType] = useState('LIMIT');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const order = {
        instrument_id: instrumentId,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        order_type: orderType,
      };
      const response = await createOrder(order);
      setSuccess(`Order ${response.data.order_id} created successfully.`);
      if (onOrderCreated) {
        onOrderCreated(response.data);
      }
      // Reset form
      setInstrumentId('');
      setQuantity('');
      setPrice('');
      setOrderType('LIMIT');
    } catch (err) {
      setError('Failed to create order. Please check the details.');
      console.error(err);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm">
      <h3 className="font-title-sm text-title-sm text-on-surface mb-md">Create New Order</h3>
      <form onSubmit={handleSubmit} className="space-y-md">
        <div>
          <label htmlFor="instrumentId" className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Instrument ID</label>
          <input
            id="instrumentId"
            type="text"
            value={instrumentId}
            onChange={(e) => setInstrumentId(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-md">
          <div>
            <label htmlFor="quantity" className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Quantity</label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Price</label>
            <input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="orderType" className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Order Type</label>
          <select
            id="orderType"
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="LIMIT">LIMIT</option>
            <option value="MARKET">MARKET</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 text-sm bg-primary text-on-primary rounded-lg font-semibold active:scale-95 transition-transform">
            Place Order
          </button>
        </div>
      </form>
      {error && <p className="text-error mt-md">{error}</p>}
      {success && <p className="text-tertiary mt-md">{success}</p>}
    </div>
  );
};

export default OrderForm;

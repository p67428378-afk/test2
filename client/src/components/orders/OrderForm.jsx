import React, { useState, useEffect } from 'react';
import { createOrder } from '../../services/api';

const OrderForm = ({ onOrderChangeForTCA }) => {
  const [instrumentId, setInstrumentId] = useState('AAPL');
  const [quantity, setQuantity] = useState('100');
  const [price, setPrice] = useState('175.00');
  const [orderType, setOrderType] = useState('LIMIT');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (onOrderChangeForTCA) {
      onOrderChangeForTCA({ instrument_id: instrumentId, quantity, order_type: orderType });
    }
  }, [instrumentId, quantity, orderType, onOrderChangeForTCA]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const order = {
        instrument_id: instrumentId,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
        order_type: orderType,
      };
      const response = await createOrder(order);
      setSuccess(`Order ${response.data.order_id} created successfully.`);
      // Do not reset form, allow for quick successive orders
    } catch (err) {
      setError('Failed to create order. Please check the details.');
      console.error(err);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 md:p-6 shadow-sm">
      <h3 className="font-title-sm text-title-sm text-on-surface mb-4">Create New Order</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="instrumentId" className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Instrument ID</label>
          <input
            id="instrumentId"
            type="text"
            value={instrumentId}
            onChange={(e) => setInstrumentId(e.target.value)}
            className="w-full bg-surface-container-low border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Quantity</label>
            <input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-surface-container-low border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="price" className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Price</label>
            <input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-surface-container-low border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              required={orderType === 'LIMIT'}
              disabled={orderType === 'MARKET'}
            />
          </div>
        </div>
        <div>
          <label htmlFor="orderType" className="block font-label-caps text-label-caps text-on-surface-variant mb-1">Order Type</label>
          <select
            id="orderType"
            value={orderType}
            onChange={(e) => setOrderType(e.target.value)}
            className="w-full bg-surface-container-low border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          >
            <option value="LIMIT">LIMIT</option>
            <option value="MARKET">MARKET</option>
          </select>
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" className="px-6 py-2 text-sm bg-primary text-on-primary rounded-lg font-semibold active:scale-95 transition-transform shadow-sm hover:bg-primary/90">
            Place Order
          </button>
        </div>
      </form>
      {error && <p className="text-error mt-4 text-sm">{error}</p>}
      {success && <p className="text-tertiary mt-4 text-sm">{success}</p>}
    </div>
  );
};

export default OrderForm;

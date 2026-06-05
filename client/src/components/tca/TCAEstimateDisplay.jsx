import React, { useState } from 'react';
import { estimateTca } from '../../services/api';

const TCAEstimateDisplay = () => {
  const [instrumentId, setInstrumentId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState('BUY');
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [error, setError] = useState(null);

  const handleEstimate = async (e) => {
    e.preventDefault();
    setError(null);
    setEstimatedCost(null);

    try {
      const trade = {
        instrument_id: instrumentId,
        quantity: parseInt(quantity),
        order_type: orderType,
      };
      const response = await estimateTca(trade);
      setEstimatedCost(response.data.estimated_cost);
    } catch (err) {
      setError('Failed to estimate TCA. Please check the details.');
      console.error(err);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg shadow-sm">
      <h3 className="font-title-sm text-title-sm text-on-surface mb-md">TCA Estimate</h3>
      <form onSubmit={handleEstimate} className="space-y-md">
        <div>
          <label htmlFor="tcaInstrumentId" className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Instrument ID</label>
          <input
            id="tcaInstrumentId"
            type="text"
            value={instrumentId}
            onChange={(e) => setInstrumentId(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-md">
          <div>
            <label htmlFor="tcaQuantity" className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Quantity</label>
            <input
              id="tcaQuantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="tcaOrderType" className="block font-label-caps text-label-caps text-on-surface-variant mb-xs">Order Type</label>
            <select
              id="tcaOrderType"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2 text-body-md focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 text-sm bg-primary text-on-primary rounded-lg font-semibold active:scale-95 transition-transform">
            Estimate Cost
          </button>
        </div>
      </form>
      {error && <p className="text-error mt-md">{error}</p>}
      {estimatedCost !== null && (
        <div className="mt-md p-md bg-surface-container-low rounded-lg">
          <p className="font-label-caps text-label-caps text-on-surface-variant">Estimated Transaction Cost</p>
          <p className="font-title-sm text-title-sm text-on-surface font-bold">${estimatedCost.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default TCAEstimateDisplay;

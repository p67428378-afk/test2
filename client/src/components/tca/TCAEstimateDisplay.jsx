import React, { useState } from 'react';
import { estimateTca } from '../../services/api';

const TCAEstimateDisplay = () => {
  const [instrumentId, setInstrumentId] = useState('AAPL');
  const [quantity, setQuantity] = useState('1000');
  const [orderType, setOrderType] = useState('MARKET');
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEstimate = async () => {
    setIsLoading(true);
    setError(null);
    setEstimatedCost(null);

    try {
      const tcaData = {
        instrument_id: instrumentId,
        quantity: parseInt(quantity, 10),
        order_type: orderType,
      };
      const result = await estimateTca(tcaData);
      setEstimatedCost(result.estimated_cost);
    } catch (err) {
      setError('Failed to estimate TCA.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-surface-container-lowest border border-outline-variant rounded-lg p-4 md:p-6 shadow-sm h-full'>
      <h3 className='font-title-sm text-base text-on-surface mb-4'>TCA Estimate</h3>
      <div className='space-y-4'>
        {/* Inputs - simplified for this component */}
        <button
          onClick={handleEstimate}
          disabled={isLoading}
          className='w-full bg-secondary text-on-secondary font-semibold py-2 px-4 rounded-md hover:bg-secondary/90 disabled:bg-secondary/50 transition-colors'
        >
          {isLoading ? 'Estimating...' : `Estimate Cost for ${quantity} ${instrumentId}`}
        </button>

        {error && <p className='text-sm text-error text-center'>{error}</p>}

        {estimatedCost !== null && (
          <div className='text-center pt-4'>
            <p className='font-label-caps text-xs text-on-surface-variant'>ESTIMATED TRANSACTION COST</p>
            <p className='font-display-lg text-3xl text-primary'>
              ${estimatedCost.toFixed(2)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TCAEstimateDisplay;

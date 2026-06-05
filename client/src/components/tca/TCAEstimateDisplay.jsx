import React, { useState, useEffect } from 'react';
import { estimateTca } from '../../services/api';

const TCAEstimateDisplay = ({ tradeToEstimate }) => {
  const [estimatedCost, setEstimatedCost] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (tradeToEstimate && tradeToEstimate.instrument_id && tradeToEstimate.quantity) {
      handleEstimate();
    }
  }, [tradeToEstimate]);

  const handleEstimate = async () => {
    if (!tradeToEstimate) return;

    setError(null);
    setEstimatedCost(null);
    setIsLoading(true);

    try {
      const trade = {
        instrument_id: tradeToEstimate.instrument_id,
        quantity: parseInt(tradeToEstimate.quantity, 10),
        order_type: tradeToEstimate.order_type,
      };
      const response = await estimateTca(trade);
      setEstimatedCost(response.data.estimated_cost);
    } catch (err) {
      setError('Failed to estimate TCA. Please check the details.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-4 md:p-6 shadow-sm h-full">
      <h3 className="font-title-sm text-title-sm text-on-surface mb-4">TCA Pre-Trade Analysis</h3>
      <div className="space-y-4">
        <p className="text-body-md text-on-surface-variant">
          This tool provides a pre-trade estimate of transaction costs based on the instrument, quantity, and order type.
        </p>
        {tradeToEstimate && (
            <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant">
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant">Instrument</p>
                        <p className="font-bold text-on-surface">{tradeToEstimate.instrument_id}</p>
                    </div>
                    <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant">Quantity</p>
                        <p className="font-bold text-on-surface">{tradeToEstimate.quantity}</p>
                    </div>
                    <div>
                        <p className="font-label-caps text-label-caps text-on-surface-variant">Type</p>
                        <p className="font-bold text-on-surface">{tradeToEstimate.order_type}</p>
                    </div>
                </div>
            </div>
        )}
        <div className="flex justify-center pt-2">
          <button onClick={handleEstimate} disabled={!tradeToEstimate || isLoading} className="px-6 py-2 text-sm bg-secondary-container text-on-secondary-container rounded-lg font-semibold active:scale-95 transition-transform shadow-sm hover:bg-secondary-container/80 disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? 'Estimating...' : 'Re-estimate Cost'}
          </button>
        </div>
      </div>
      
      {error && <p className="text-error mt-4 text-sm">{error}</p>}
      
      {estimatedCost !== null && (
        <div className="mt-4 p-4 bg-primary-container rounded-lg text-center">
          <p className="font-label-caps text-label-caps text-on-primary-container">Estimated Transaction Cost</p>
          <p className="font-display-lg text-display-lg text-on-primary-container font-bold">${estimatedCost.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default TCAEstimateDisplay;

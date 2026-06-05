import React, { useState } from 'react';
import OrderForm from '../components/orders/OrderForm';
import TCAEstimateDisplay from '../components/tca/TCAEstimateDisplay';

const OrderEntryPage = () => {
  const [tcaRequest, setTcaRequest] = useState(null);

  const handleOrderChangeForTCA = (trade) => {
    setTcaRequest(trade);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <OrderForm onOrderChangeForTCA={handleOrderChangeForTCA} />
      </div>
      <div>
        <TCAEstimateDisplay tradeToEstimate={tcaRequest} />
      </div>
    </div>
  );
};

export default OrderEntryPage;

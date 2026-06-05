import React from 'react';
import OrderForm from '../components/orders/OrderForm';
import TCAEstimateDisplay from '../components/tca/TCAEstimateDisplay';

const OrderEntryPage = () => {
  const handleOrderCreated = (order) => {
    // Can be used to update a global state or show a notification
    console.log('Order created:', order);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
      <OrderForm onOrderCreated={handleOrderCreated} />
      <TCAEstimateDisplay />
    </div>
  );
};

export default OrderEntryPage;

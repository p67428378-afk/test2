import React from 'react';
import OrderForm from '../components/orders/OrderForm';
import TCAEstimateDisplay from '../components/tca/TCAEstimateDisplay';

const OrderEntryPage = () => {
  const handleOrderCreated = (newOrder) => {
    // In a real app, you might show a success notification
    // or navigate to the order blotter page.
    console.log('Order created:', newOrder);
    alert(`Order ${newOrder.order_id} created successfully!`);
  };

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
      <div className='lg:col-span-2'>
        <OrderForm onOrderCreated={handleOrderCreated} />
      </div>
      <div>
        <TCAEstimateDisplay />
      </div>
    </div>
  );
};

export default OrderEntryPage;

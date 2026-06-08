import React, { useEffect, useState } from 'react';
import WarningBanner from '../components/maintenance/WarningBanner';
import WorkOrdersTable from '../components/maintenance/WorkOrdersTable';
import CreateWorkOrderForm from '../components/maintenance/CreateWorkOrderForm';
import { getMaintenanceOrders, createMaintenanceOrder, updateMaintenanceOrder, getPipelines } from '../services/api';

export default function MaintenancePage() {
  const [orders, setOrders] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const ordersData = await getMaintenanceOrders();
      setOrders(ordersData);
      const pipelinesData = await getPipelines();
      setPipelines(pipelinesData);
    } catch (err) {
      console.error('Error fetching maintenance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOrder = async (orderData) => {
    try {
      await createMaintenanceOrder(orderData);
      await fetchData();
    } catch (err) {
      console.error('Error creating work order:', err);
    }
  };

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateMaintenanceOrder(orderId, { status });
      await fetchData();
    } catch (err) {
      console.error('Error updating work order status:', err);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-[calc(100vh-120px)] text-on-surface-variant'>
        <span className='material-symbols-outlined animate-spin text-4xl'>sync</span>
        <span className='ml-sm font-semibold'>Loading Maintenance Module...</span>
      </div>
    );
  }

  return (
    <div className='space-y-lg'>
      <div className='flex justify-between items-center'>
        <h2 className='font-headline-md text-headline-md font-bold text-on-surface'>Maintenance Scheduling & Tracking</h2>
      </div>

      <WarningBanner orders={orders} />

      <div className='grid grid-cols-12 gap-gutter'>
        <div className='col-span-8'>
          <WorkOrdersTable orders={orders} onUpdateStatus={handleUpdateStatus} />
        </div>
        <div className='col-span-4'>
          <CreateWorkOrderForm pipelines={pipelines} onCreateOrder={handleCreateOrder} />
        </div>
      </div>
    </div>
  );
}

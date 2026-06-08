import React, { useState, useEffect } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { getInventory, getExpiryAlerts } from '../services/api';

const Dashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [expiryAlerts, setExpiryAlerts] = useState([]);

  useEffect(() => {
    getInventory().then(response => setInventory(response.data));
    getExpiryAlerts().then(response => setExpiryAlerts(response.data));
  }, []);

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter(item => item.quantity < 10).length;

  return (
    <div className='grid grid-cols-12 gap-6'>
      {/* Summary Section */}
      <div className='col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <div className='flex justify-between items-start mb-4'>
            <div className='bg-primary/10 p-3 rounded-lg text-primary'>
              <span className='material-symbols-outlined' data-icon='inventory'>inventory</span>
            </div>
            <span className='text-label-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded'>Update 2m ago</span>
          </div>
          <h3 className='font-h3 text-h3 text-on-surface mb-1'>Current Inventory</h3>
          <div className='space-y-4'>
            <div>
              <p className='font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider'>Total Snacks</p>
              <p className='font-h2 text-h2 text-primary'>{totalItems} <span className='text-body-sm font-normal text-on-surface-variant'>items</span></p>
            </div>
            {lowStockItems > 0 && (
              <div className='bg-error-container/30 border border-error/20 p-4 rounded-lg'>
                <div className='flex items-center gap-2 text-error mb-1'>
                  <span className='material-symbols-outlined text-sm' data-icon='warning'>warning</span>
                  <span className='font-label-md text-label-md font-bold'>Action Required</span>
                </div>
                <p className='font-body-md text-body-md text-on-error-container'>Low Stock Items: <span className='font-bold'>{lowStockItems}</span></p>
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className='flex items-center gap-2 mb-6'>
            <div className='bg-secondary/10 p-3 rounded-lg text-secondary'>
              <span className='material-symbols-outlined' data-icon='bolt'>bolt</span>
            </div>
            <h3 className='font-h3 text-h3 text-on-surface'>Quick Actions</h3>
          </div>
          <div className='flex flex-col gap-3'>
            <Button className='w-full justify-between'>
              <span className='flex items-center gap-3'><span className='material-symbols-outlined'>add_circle</span>Request New Snack</span>
              <span className='material-symbols-outlined'>chevron_right</span>
            </Button>
            <Button className='w-full justify-between bg-secondary text-on-secondary'>
              <span className='flex items-center gap-3'><span className='material-symbols-outlined'>restaurant</span>Mark Snack Consumed</span>
              <span className='material-symbols-outlined'>chevron_right</span>
            </Button>
            <Button className='w-full justify-between bg-surface-container text-on-surface-variant border border-outline-variant'>
              <span className='flex items-center gap-3'><span className='material-symbols-outlined'>history</span>View Consumption Log</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Expiry Alerts Section */}
      <div className='col-span-12 lg:col-span-4'>
        <Card className='h-full flex flex-col'>
          <div className='p-6 border-b border-outline-variant flex justify-between items-center'>
            <div className='flex items-center gap-2'>
              <span className='material-symbols-outlined text-secondary' data-icon='notification_important'>notification_important</span>
              <h3 className='font-h3 text-h3 text-on-surface'>Expiry Alerts</h3>
            </div>
            <span className='bg-error-container text-on-error-container px-2 py-0.5 rounded-full text-label-sm font-bold'>{expiryAlerts.filter(a => a.alert_status === 'critical').length} critical</span>
          </div>
          <div className='flex-grow p-4 space-y-3 overflow-y-auto'>
            {expiryAlerts.map(alert => (
              <div key={alert.id} className='p-4 bg-surface-container-low border border-outline-variant rounded-lg flex items-start gap-4 hover:bg-surface-container transition-colors'>
                <div className='bg-primary text-on-primary w-10 h-10 rounded-full flex items-center justify-center shrink-0'>
                  <span className='material-symbols-outlined text-[20px]'>fastfood</span>
                </div>
                <div className='flex-grow'>
                  <div className='flex justify-between items-start'>
                    <h4 className='font-label-md text-label-md font-bold text-on-surface'>{alert.snack_name}</h4>
                    <span className='text-error font-bold text-label-sm'>{new Date(alert.expiry_date).toLocaleDateString()}</span>
                  </div>
                  <p className='text-body-sm text-on-surface-variant'>Qty: {alert.quantity} units</p>
                </div>
              </div>
            ))}
          </div>
          <div className='p-4 border-t border-outline-variant'>
            <Button className='w-full py-2.5 text-primary font-label-md text-label-md hover:bg-primary/5 rounded-lg transition-colors border border-primary/20'>
              View All Expiry Alerts
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

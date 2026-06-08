import React, { useEffect, useState } from 'react';
import AlertsFeedTable from '../components/alerts/AlertsFeedTable';
import ThresholdConfigForm from '../components/alerts/ThresholdConfigForm';
import EmergencyProtocolCard from '../components/alerts/EmergencyProtocolCard';
import { getAlerts, acknowledgeAlert } from '../services/api';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      const data = await getAlerts();
      setAlerts(data);
      if (data.length > 0) {
        setSelectedAlert(data[0]);
      }
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAcknowledge = async (alertId) => {
    try {
      await acknowledgeAlert(alertId);
      await fetchAlerts();
    } catch (err) {
      console.error('Error acknowledging alert:', err);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-[calc(100vh-120px)] text-on-surface-variant'>
        <span className='material-symbols-outlined animate-spin text-4xl'>sync</span>
        <span className='ml-sm font-semibold'>Loading Alerts Control...</span>
      </div>
    );
  }

  return (
    <div className='space-y-lg'>
      <div className='flex justify-between items-center'>
        <h2 className='font-headline-md text-headline-md font-bold text-on-surface'>Gas Leak Alert System</h2>
      </div>

      <div className='grid grid-cols-12 gap-gutter'>
        <div className='col-span-8'>
          <AlertsFeedTable
            alerts={alerts}
            onAcknowledge={handleAcknowledge}
            onViewProtocol={(alert) => setSelectedAlert(alert)}
          />
        </div>
        <div className='col-span-4 space-y-lg'>
          <EmergencyProtocolCard alert={selectedAlert} />
          <ThresholdConfigForm />
        </div>
      </div>
    </div>
  );
}

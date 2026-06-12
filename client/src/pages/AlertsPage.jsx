import React, { useState, useEffect } from 'react';
import AlertsTable from '../components/alerts/AlertsTable';
import { getAlerts } from '../services/api';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAlerts = async () => {
    try {
      setIsLoading(true);
      const params = statusFilter ? { status: statusFilter } : {};
      const data = await getAlerts(params);
      setAlerts(data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display-lg text-display-lg text-on-surface">Transaction Alerts</h1>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Monitor and resolve system-triggered transaction alerts for suspicious activity.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-on-surface-variant">Loading alerts...</div>
      ) : (
        <AlertsTable
          alerts={alerts}
          onStatusFilterChange={setStatusFilter}
          currentFilter={statusFilter}
        />
      )}
    </div>
  );
}
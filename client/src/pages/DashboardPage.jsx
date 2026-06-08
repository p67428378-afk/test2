import React, { useEffect, useState } from 'react';
import KPISection from '../components/dashboard/KPISection';
import PipelineMap from '../components/dashboard/PipelineMap';
import SelectedSegmentDetails from '../components/dashboard/SelectedSegmentDetails';
import AlertsFeedTable from '../components/alerts/AlertsFeedTable';
import { getPipelines, getPipelineSensors, getAlerts, acknowledgeAlert } from '../services/api';

export default function DashboardPage() {
  const [pipelines, setPipelines] = useState([]);
  const [selectedPipeline, setSelectedPipeline] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const pipelinesData = await getPipelines();
      setPipelines(pipelinesData);
      
      // Select Sector 4B by default if available
      const sector4B = pipelinesData.find(p => p.name.includes('Sector 4B') || p.location.includes('Sector 4B'));
      if (sector4B) {
        setSelectedPipeline(sector4B);
        const sensorsData = await getPipelineSensors(sector4B.id);
        setSensors(sensorsData);
      } else if (pipelinesData.length > 0) {
        setSelectedPipeline(pipelinesData[0]);
        const sensorsData = await getPipelineSensors(pipelinesData[0].id);
        setSensors(sensorsData);
      }

      const alertsData = await getAlerts();
      setAlerts(alertsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSelectPipeline = async (pipeline) => {
    setSelectedPipeline(pipeline);
    try {
      const sensorsData = await getPipelineSensors(pipeline.id);
      setSensors(sensorsData);
    } catch (err) {
      console.error('Error fetching sensors:', err);
    }
  };

  const handleAcknowledgeAlert = async (alertId) => {
    try {
      await acknowledgeAlert(alertId);
      // Refresh alerts
      const alertsData = await getAlerts();
      setAlerts(alertsData);
    } catch (err) {
      console.error('Error acknowledging alert:', err);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-[calc(100vh-120px)] text-on-surface-variant'>
        <span className='material-symbols-outlined animate-spin text-4xl'>sync</span>
        <span className='ml-sm font-semibold'>Loading SafePipe Dashboard...</span>
      </div>
    );
  }

  // Calculate KPI stats
  const pipelinesCount = pipelines.length;
  const sensorsCount = pipelinesCount * 12; // Simulated or actual
  const activeAlertsCount = alerts.filter(a => alert.status === 'active' || a.status === 'active').length;
  const maintenanceCount = 1; // Simulated or fetched

  return (
    <div className='space-y-lg'>
      <KPISection
        pipelinesCount={pipelinesCount}
        sensorsCount={sensorsCount}
        activeAlertsCount={activeAlertsCount}
        maintenanceCount={maintenanceCount}
      />

      <div className='grid grid-cols-12 gap-gutter'>
        <PipelineMap
          pipelines={pipelines}
          selectedPipeline={selectedPipeline}
          onSelectPipeline={handleSelectPipeline}
          onAcknowledgeAlert={() => {
            const criticalAlert = alerts.find(a => a.severity === 'critical' && a.status === 'active');
            if (criticalAlert) handleAcknowledgeAlert(criticalAlert.id);
          }}
        />
        <SelectedSegmentDetails
          selectedPipeline={selectedPipeline}
          sensors={sensors}
        />
      </div>

      <AlertsFeedTable
        alerts={alerts}
        onAcknowledge={handleAcknowledgeAlert}
      />
    </div>
  );
}

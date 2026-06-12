import React, { useEffect, useState } from 'react';
import SensorGauge from '../components/growth/SensorGauge.jsx';
import GrowthTimeline from '../components/growth/GrowthTimeline.jsx';
import AlertPanel from '../components/growth/AlertPanel.jsx';
import { getPlantBatches, updatePlantBatch, submitSensorData } from '../services/api.js';

export default function GrowthPage() {
  const [batches, setBatches] = useState([]);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [loading, setLoading] = useState(true);

  // Form state for submitting mock sensor data
  const [temp, setTemp] = useState('24');
  const [humidity, setHumidity] = useState('65');
  const [moisture, setMoisture] = useState('45');
  const [light, setLight] = useState('500');

  const fetchData = async () => {
    try {
      const batchesData = await getPlantBatches();
      setBatches(batchesData);
      if (batchesData.length > 0 && !selectedBatchId) {
        setSelectedBatchId(batchesData[0].batch_id);
      }
    } catch (error) {
      console.error('Error fetching plant batches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStage = async (batchId, newStage) => {
    try {
      await updatePlantBatch(batchId, { growth_stage: newStage });
      await fetchData();
    } catch (error) {
      console.error('Error updating growth stage:', error);
    }
  };

  const handleMockSensorSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBatchId) return;
    try {
      await submitSensorData({
        batch_id: selectedBatchId,
        temperature: parseFloat(temp),
        humidity: parseFloat(humidity),
        soil_moisture: parseFloat(moisture),
        light_intensity: parseFloat(light)
      });
      await fetchData();
    } catch (error) {
      console.error('Error submitting sensor data:', error);
    }
  };

  if (loading) {
    return <div className='text-center py-12 text-on-surface-variant'>Loading growth tracking...</div>;
  }

  const selectedBatch = batches.find((b) => b.batch_id === selectedBatchId) || batches[0];
  const sensor = selectedBatch?.latest_sensor_data || {};

  return (
    <div className='space-y-gutter'>
      <div className='flex justify-between items-center'>
        <div>
          <h3 className='font-headline-sm text-headline-sm text-primary font-bold'>Growth Tracking</h3>
          <p className='font-label-sm text-on-surface-variant mt-1'>
            Monitor real-time environmental conditions and manage growth stages.
          </p>
        </div>
        {batches.length > 0 && (
          <div className='flex items-center gap-3'>
            <label className='font-label-lg text-on-surface-variant'>Select Batch:</label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className='bg-[#1E293B] border border-outline-variant/50 rounded-lg p-2 text-on-surface focus:outline-none focus:border-primary'
            >
              {batches.map((b) => (
                <option key={b.batch_id} value={b.batch_id}>
                  {b.flower_type} ({b.batch_id.substring(0, 8).toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedBatch ? (
        <>
          {/* Sensor Gauges */}
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter'>
            <SensorGauge
              label='Temperature'
              value={sensor.temperature}
              unit='°C'
              icon='thermostat'
              colorClass='text-orange-500'
            />
            <SensorGauge
              label='Humidity'
              value={sensor.humidity}
              unit='%'
              icon='humidity_percentage'
              colorClass='text-blue-500'
            />
            <SensorGauge
              label='Soil Moisture'
              value={sensor.soil_moisture}
              unit='%'
              icon='water_drop'
              colorClass={sensor.soil_moisture < 30 ? 'text-red-500' : 'text-primary'}
            />
            <SensorGauge
              label='Light Intensity'
              value={sensor.light_intensity}
              unit=' lx'
              icon='light_mode'
              colorClass='text-yellow-500'
            />
          </div>

          {/* Growth Stage Timeline */}
          <GrowthTimeline batch={selectedBatch} onUpdateStage={handleUpdateStage} />

          {/* Environmental Alerts */}
          <AlertPanel batches={batches} />

          {/* Mock Sensor Data Ingestion Form */}
          <div className='card-level-1 rounded-xl p-5 micro-shadow'>
            <div className='flex items-center gap-3 mb-4 border-b border-outline-variant/20 pb-3'>
              <span className='material-symbols-outlined text-primary'>sensors</span>
              <h3 className='font-label-lg text-on-surface font-bold'>Mock IoT Sensor Ingestion</h3>
            </div>
            <form onSubmit={handleMockSensorSubmit} className='grid grid-cols-1 md:grid-cols-5 gap-4 items-end'>
              <div>
                <label className='block font-label-sm text-on-surface-variant mb-1'>Temp (°C)</label>
                <input
                  type='number'
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className='w-full bg-[#0F172A] border border-outline-variant/50 rounded-lg p-2 text-on-surface focus:outline-none focus:border-primary'
                  required
                />
              </div>
              <div>
                <label className='block font-label-sm text-on-surface-variant mb-1'>Humidity (%)</label>
                <input
                  type='number'
                  value={humidity}
                  onChange={(e) => setHumidity(e.target.value)}
                  className='w-full bg-[#0F172A] border border-outline-variant/50 rounded-lg p-2 text-on-surface focus:outline-none focus:border-primary'
                  required
                />
              </div>
              <div>
                <label className='block font-label-sm text-on-surface-variant mb-1'>Soil Moisture (%)</label>
                <input
                  type='number'
                  value={moisture}
                  onChange={(e) => setMoisture(e.target.value)}
                  className='w-full bg-[#0F172A] border border-outline-variant/50 rounded-lg p-2 text-on-surface focus:outline-none focus:border-primary'
                  required
                />
              </div>
              <div>
                <label className='block font-label-sm text-on-surface-variant mb-1'>Light (lx)</label>
                <input
                  type='number'
                  value={light}
                  onChange={(e) => setLight(e.target.value)}
                  className='w-full bg-[#0F172A] border border-outline-variant/50 rounded-lg p-2 text-on-surface focus:outline-none focus:border-primary'
                  required
                />
              </div>
              <button
                type='submit'
                className='bg-primary text-on-primary font-label-lg py-2 px-4 rounded-lg hover:bg-primary-fixed transition-colors duration-200 shadow-sm'
              >
                Ingest Data
              </button>
            </form>
          </div>
        </>
      ) : (
        <div className='text-center py-12 text-on-surface-variant'>No plant batches found.</div>
      )}
    </div>
  );
}
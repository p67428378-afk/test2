import React, { useEffect, useState } from 'react';
import KPIBar from '../components/dashboard/KPIBar.jsx';
import GrowthStatusCard from '../components/dashboard/GrowthStatusCard.jsx';
import ShelfLifeAlertCard from '../components/dashboard/ShelfLifeAlertCard.jsx';
import { getPlantBatches, getInventory, getTasks, updateTask } from '../services/api.js';

export default function DashboardPage() {
  const [batches, setBatches] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [batchesData, inventoryData, tasksData] = await Promise.all([
          getPlantBatches(),
          getInventory(),
          getTasks()
        ]);
        setBatches(batchesData);
        setInventory(inventoryData);
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      const updatedTasks = await getTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (loading) {
    return <div className='text-center py-12 text-on-surface-variant'>Loading dashboard...</div>;
  }

  // Calculate dynamic KPI values
  const activeBatchesCount = batches.length;
  const inventoryStemsCount = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowMoistureBatches = batches.filter(b => b.latest_sensor_data && b.latest_sensor_data.soil_moisture < 30);
  const criticalAlertsCount = lowMoistureBatches.length;
  const criticalAlertText = criticalAlertsCount > 0
    ? `Low Soil Moisture in ${lowMoistureBatches[0].flower_type || 'Batch'}`
    : 'All systems normal';
  const pendingTasksCount = tasks.filter(t => t.status === 'Pending').length;

  return (
    <div className='space-y-gutter'>
      <KPIBar
        activeBatchesCount={activeBatchesCount}
        inventoryStemsCount={inventoryStemsCount}
        criticalAlertsCount={criticalAlertsCount}
        criticalAlertText={criticalAlertText}
        pendingTasksCount={pendingTasksCount}
      />

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-gutter'>
        <div className='lg:col-span-8'>
          <GrowthStatusCard batches={batches} />
        </div>
        <div className='lg:col-span-4'>
          <ShelfLifeAlertCard inventory={inventory} />
        </div>
      </div>

      {/* Today's Schedule Timeline */}
      <div className='card-level-1 rounded-xl flex flex-col micro-shadow'>
        <div className='p-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/50'>
          <div className='flex items-center gap-3'>
            <span className='material-symbols-outlined text-primary'>schedule</span>
            <h3 className='font-label-lg text-on-surface'>Today's Schedule</h3>
          </div>
        </div>
        <div className='p-6 relative'>
          <div className='absolute left-[88px] top-8 bottom-8 w-px bg-outline-variant/30'></div>
          <div className='space-y-6'>
            {tasks.length === 0 ? (
              <div className='text-center text-on-surface-variant py-4'>No tasks scheduled for today.</div>
            ) : (
              tasks.slice(0, 3).map((task, idx) => {
                const isCompleted = task.status === 'Completed';
                return (
                  <div key={task.task_id} className='flex items-start gap-6 relative z-10'>
                    <div className='w-16 text-right pt-1 shrink-0'>
                      <span className='font-data-mono text-sm text-on-surface-variant'>
                        {idx === 0 ? '08:00 AM' : idx === 1 ? '11:00 AM' : '03:00 PM'}
                      </span>
                    </div>
                    <div className={`w-3 h-3 rounded-full border-2 mt-1.5 shrink-0 ${
                      isCompleted ? 'bg-primary border-primary' : 'border-primary bg-[#1E293B]'
                    } ring-4 ring-[#1E293B]`}></div>
                    <div
                      onClick={() => handleUpdateTaskStatus(task.task_id, isCompleted ? 'Pending' : 'Completed')}
                      className='flex-1 bg-[#0F172A]/50 border border-outline-variant/30 rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer'
                    >
                      <div className='flex items-start justify-between'>
                        <div>
                          <h4 className={`font-label-lg text-on-surface ${isCompleted ? 'line-through text-on-surface-variant' : ''}`}>
                            {task.task_type}
                          </h4>
                          <p className='font-label-sm text-on-surface-variant mt-1 font-data-mono'>
                            {task.description}
                          </p>
                        </div>
                        <div className={`px-2 py-1 rounded flex items-center gap-1 ${
                          isCompleted ? 'status-success' : 'bg-surface-container border border-outline-variant/50'
                        }`}>
                          {isCompleted && <span className='material-symbols-outlined text-[14px]'>check_circle</span>}
                          <span className='text-xs font-bold uppercase tracking-wider'>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
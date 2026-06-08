import React, { useState } from 'react';

export default function CreateWorkOrderForm({ pipelines = [], onCreateOrder }) {
  const [pipelineId, setPipelineId] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!pipelineId || !description.trim() || !assignedTo.trim() || !dueDate) {
      setError('Please fill in all required fields.');
      return;
    }

    // Check for scheduling conflict (e.g. if the crew is already assigned to another task on the same day)
    // For simplicity, we can simulate this check or just call onCreateOrder
    onCreateOrder({
      pipeline_id: pipelineId,
      description,
      assigned_to: assignedTo,
      priority,
      due_date: new Date(dueDate).toISOString(),
    });

    // Reset form
    setPipelineId('');
    setDescription('');
    setAssignedTo('');
    setPriority('medium');
    setDueDate('');
  };

  return (
    <section className='bento-card p-md rounded-lg flex flex-col gap-md'>
      <h3 className='font-title-sm text-title-sm text-on-surface'>Create Maintenance Work Order</h3>
      {error && <p className='text-error text-body-sm font-semibold'>{error}</p>}
      <form onSubmit={handleSubmit} className='space-y-md'>
        <div>
          <label className='block font-label-mono text-label-mono text-on-surface-variant mb-xs'>AFFECTED PIPELINE SEGMENT *</label>
          <select
            value={pipelineId}
            onChange={(e) => setPipelineId(e.target.value)}
            className='w-full bg-surface-container-low border border-outline-variant rounded p-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none'
            required
          >
            <option value=''>Select Segment...</option>
            {pipelines.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.location})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className='block font-label-mono text-label-mono text-on-surface-variant mb-xs'>DESCRIPTION *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder='Describe the maintenance task...'
            className='w-full bg-surface-container-low border border-outline-variant rounded p-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none h-24'
            required
          />
        </div>
        <div>
          <label className='block font-label-mono text-label-mono text-on-surface-variant mb-xs'>ASSIGNED CREW *</label>
          <input
            type='text'
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            placeholder='e.g. Crew Alpha, John Doe'
            className='w-full bg-surface-container-low border border-outline-variant rounded p-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none'
            required
          />
        </div>
        <div className='grid grid-cols-2 gap-md'>
          <div>
            <label className='block font-label-mono text-label-mono text-on-surface-variant mb-xs'>PRIORITY</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className='w-full bg-surface-container-low border border-outline-variant rounded p-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none'
            >
              <option value='low'>Low</option>
              <option value='medium'>Medium</option>
              <option value='high'>High</option>
            </select>
          </div>
          <div>
            <label className='block font-label-mono text-label-mono text-on-surface-variant mb-xs'>DUE DATE *</label>
            <input
              type='date'
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className='w-full bg-surface-container-low border border-outline-variant rounded p-sm text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none'
              required
            />
          </div>
        </div>
        <button
          type='submit'
          className='w-full bg-primary text-on-primary py-sm rounded font-bold hover:opacity-90 transition-all active:scale-95'
        >
          Schedule Work Order
        </button>
      </form>
    </section>
  );
}

import React, { useEffect, useState } from 'react';
import { getScenarios, selectScenario } from '../services/api';

export default function ScenarioComparison() {
  const [scenarios, setScenarios] = useState([]);
  const [selectedId, setSelectedId] = useState('balanced');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function fetchScenarios() {
      try {
        const data = await getScenarios();
        setScenarios(data);
        // Find which one is selected in the backend
        // If none, default to 'balanced'
        const selected = data.find((s) => s.is_selected);
        if (selected) {
          setSelectedId(selected.id);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load scenarios.');
      } finally {
        setLoading(false);
      }
    }
    fetchScenarios();
  }, []);

  const handleSelect = async (id) => {
    try {
      setError(null);
      setSuccessMessage('');
      await selectScenario(id);
      setSelectedId(id);
      setSuccessMessage(`Successfully selected the ${id.charAt(0).toUpperCase() + id.slice(1)} scenario!`);
    } catch (err) {
      console.error(err);
      setError('Failed to select scenario.');
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center h-full p-8'>
        <div className='text-slate-500 font-medium'>Loading scenarios...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-8'>
        <div className='bg-red-50 border border-red-200 text-red-800 rounded-lg p-4'>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h3 className='text-xl font-bold text-slate-900'>Scenario Comparison</h3>
          <p className='text-sm text-slate-500'>
            Compare and select the optimal assortment strategy for the Snacks category.
          </p>
        </div>
      </div>

      {successMessage && (
        <div className='bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg p-4 text-sm font-medium'>
          {successMessage}
        </div>
      )}

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {scenarios.map((scenario) => {
          const isSelected = selectedId === scenario.id;
          return (
            <div
              key={scenario.id}
              className={`glass-card rounded-xl p-6 flex flex-col justify-between transition-all border-2 ${
                isSelected
                  ? 'border-amber-400 ring-4 ring-amber-400/10 bg-white'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className='space-y-4'>
                <div className='flex justify-between items-start'>
                  <div>
                    <h4 className='text-lg font-bold text-slate-900'>{scenario.name}</h4>
                    <p className='text-xs text-slate-400 uppercase tracking-wider font-semibold mt-1'>
                      {scenario.id}
                    </p>
                  </div>
                  {isSelected && (
                    <span className='inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200'>
                      <span className='material-symbols-outlined text-[14px]'>check</span>
                      Selected
                    </span>
                  )}
                </div>

                <p className='text-sm text-slate-600 leading-relaxed min-h-[60px]'>
                  {scenario.description}
                </p>

                {/* Projected Impact Metrics */}
                <div className='border-t border-b border-slate-100 py-4 space-y-3'>
                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-slate-500 font-medium'>Projected Sales Lift</span>
                    <span className='text-sm font-bold text-emerald-700'>
                      +{scenario.projected_sales_lift.toFixed(1)}%
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-slate-500 font-medium'>New Private Brand %</span>
                    <span className='text-sm font-bold text-slate-900'>
                      {scenario.new_private_brand_pct.toFixed(1)}%
                    </span>
                  </div>
                  <div className='flex justify-between items-center'>
                    <span className='text-xs text-slate-500 font-medium'>Shelf Space Impact</span>
                    <span className={`text-sm font-bold ${
                      scenario.shelf_space_impact_ft < 0
                        ? 'text-amber-700'
                        : scenario.shelf_space_impact_ft > 0
                        ? 'text-emerald-700'
                        : 'text-slate-600'
                    }`}>
                      {scenario.shelf_space_impact_ft > 0 ? '+' : ''}
                      {scenario.shelf_space_impact_ft.toFixed(1)} ft
                    </span>
                  </div>
                </div>

                {/* SKU Changes Summary */}
                <div className='space-y-3'>
                  <h5 className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
                    SKU Changes
                  </h5>
                  <div className='space-y-2 max-h-[180px] overflow-y-auto pr-1'>
                    {scenario.items_to_add.map((item) => (
                      <div
                        key={item.sku}
                        className='flex items-center justify-between text-xs bg-emerald-50/50 border border-emerald-100 rounded p-2'
                      >
                        <div className='min-w-0 flex-1'>
                          <p className='font-semibold text-emerald-900 truncate'>{item.name}</p>
                          <p className='font-mono text-emerald-700 mt-0.5'>{item.sku}</p>
                        </div>
                        <span className='text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0 ml-2'>
                          Add
                        </span>
                      </div>
                    ))}
                    {scenario.items_to_remove.map((item) => (
                      <div
                        key={item.sku}
                        className='flex items-center justify-between text-xs bg-red-50/50 border border-red-100 rounded p-2'
                      >
                        <div className='min-w-0 flex-1'>
                          <p className='font-semibold text-red-900 truncate'>{item.name}</p>
                          <p className='font-mono text-red-700 mt-0.5'>{item.sku}</p>
                        </div>
                        <span className='text-[10px] font-bold uppercase text-red-800 bg-red-100 px-1.5 py-0.5 rounded shrink-0 ml-2'>
                          Remove
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelect(scenario.id)}
                disabled={isSelected}
                className={`w-full mt-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  isSelected
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-sm'
                }`}
              >
                {isSelected ? 'Currently Selected' : 'Select Scenario'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getScenarioProjections, createScenario } from '../services/api.js';

export default function ScenarioComparisonPage() {
  const navigate = useNavigate();
  const [projections, setProjections] = useState([]);
  const [selectedType, setSelectedType] = useState('Balanced');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjections = async () => {
      try {
        setLoading(true);
        const data = await getScenarioProjections();
        setProjections(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projections:', err);
        setError('Failed to load scenario projections. Using offline fallback.');
        // Fallback projections matching WorkSpec
        setProjections([
          {
            type: 'Conservative',
            name: 'Conservative Strategy',
            description: 'Focuses on low-risk, high-in-stock items.',
            projected_sales_lift: 2.5,
            private_brand_percentage: 22.0,
            in_stock_rate: 98.5,
            shelf_space_utilized: 80.0
          },
          {
            type: 'Balanced',
            name: 'Balanced Strategy',
            description: 'Balances sales lift with private brand goals.',
            projected_sales_lift: 5.8,
            private_brand_percentage: 26.5,
            in_stock_rate: 96.0,
            shelf_space_utilized: 88.0
          },
          {
            type: 'Aggressive',
            name: 'Aggressive Strategy',
            description: 'Maximizes sales lift with higher risk.',
            projected_sales_lift: 10.2,
            private_brand_percentage: 31.0,
            in_stock_rate: 92.5,
            shelf_space_utilized: 95.0
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjections();
  }, []);

  const handleSelectAndReview = async () => {
    const selectedProj = projections.find(p => p.type === selectedType);
    if (!selectedProj) return;

    try {
      // Create a new scenario based on the selected strategy
      const newScenario = await createScenario({
        name: `My ${selectedProj.type} Scenario`,
        description: selectedProj.description,
        strategy_type: selectedProj.type
      });
      // Navigate to review page with the created scenario ID
      navigate('/review', { state: { scenarioId: newScenario.id } });
    } catch (err) {
      console.error('Error creating scenario:', err);
      // Fallback navigation with a mock ID if API fails
      navigate('/review', { state: { scenarioId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', strategyType: selectedType } });
    }
  };

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-[#ffd200]'>Scenario Comparison</h1>
        <p className='text-sm text-[#d1c6ab]'>Compare different assortment strategies and select the best fit for your cluster.</p>
      </div>

      {error && (
        <div className='p-4 bg-[#93000a]/20 border border-[#93000a] text-[#ffdad6] rounded-lg flex items-center gap-2'>
          <span className='material-symbols-outlined'>error</span>
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className='flex justify-center items-center py-12'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffd200]'></div>
        </div>
      ) : (
        <div className='space-y-6'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {projections.map((proj) => {
              const isSelected = selectedType === proj.type;
              return (
                <div 
                  key={proj.type}
                  onClick={() => setSelectedType(proj.type)}
                  className={`cursor-pointer rounded-lg p-6 border transition-all flex flex-col justify-between h-full ${
                    isSelected 
                      ? 'bg-[#ffd200]/10 border-[#ffd200] shadow-[0_0_8px_rgba(255,210,0,0.3)]' 
                      : 'bg-[#1E293B] border-[#334155] hover:border-[#ffd200]/50'
                  }`}
                >
                  <div>
                    <div className='flex justify-between items-start mb-4'>
                      <h3 className='text-lg font-bold text-[#dae2fd]'>{proj.name}</h3>
                      {isSelected && (
                        <span className='material-symbols-outlined text-[#ffd200]'>check_circle</span>
                      )}
                    </div>
                    <p className='text-sm text-[#d1c6ab] mb-6'>{proj.description}</p>

                    <div className='space-y-4'>
                      <div className='flex justify-between items-center border-b border-[#334155] pb-2'>
                        <span className='text-xs text-[#d1c6ab] uppercase tracking-wider'>Projected Sales Lift</span>
                        <span className='text-lg font-semibold text-[#10B981]'>+{proj.projected_sales_lift}%</span>
                      </div>
                      <div className='flex justify-between items-center border-b border-[#334155] pb-2'>
                        <span className='text-xs text-[#d1c6ab] uppercase tracking-wider'>Private Brand %</span>
                        <span className='text-sm font-medium text-[#dae2fd]'>{proj.private_brand_percentage}%</span>
                      </div>
                      <div className='flex justify-between items-center border-b border-[#334155] pb-2'>
                        <span className='text-xs text-[#d1c6ab] uppercase tracking-wider'>In-Stock Rate</span>
                        <span className='text-sm font-medium text-[#dae2fd]'>{proj.in_stock_rate}%</span>
                      </div>
                      <div className='flex justify-between items-center pb-2'>
                        <span className='text-xs text-[#d1c6ab] uppercase tracking-wider'>Shelf Space Utilized</span>
                        <span className='text-sm font-medium text-[#dae2fd]'>{proj.shelf_space_utilized}%</span>
                      </div>
                    </div>
                  </div>

                  <div className='mt-6 pt-4 border-t border-[#334155]'>
                    <button 
                      className={`w-full py-2 rounded font-bold text-sm transition-colors ${
                        isSelected 
                          ? 'bg-[#ffd200] text-[#231b00]' 
                          : 'bg-[#31394d] text-[#dae2fd] hover:bg-[#ffd200]/20'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Select Strategy'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className='flex justify-end pt-4'>
            <button 
              onClick={handleSelectAndReview}
              className='px-6 py-3 bg-[#ffd200] text-[#231b00] font-bold rounded hover:bg-[#ecc200] transition-colors flex items-center gap-2 shadow-lg'
            >
              <span>Select &amp; Review</span>
              <span className='material-symbols-outlined'>arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

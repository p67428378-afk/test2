import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import KPIGrid from '../components/assortment/KPIGrid.jsx';
import SKUPerformanceTable from '../components/assortment/SKUPerformanceTable.jsx';
import { getKPIs, getSKUsPerformance } from '../services/api.js';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(null);
  const [skus, setSkus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [kpiData, skusData] = await Promise.all([
          getKPIs(),
          getSKUsPerformance()
        ]);
        setKpis(kpiData);
        setSkus(skusData);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Using offline fallback.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOptimize = (sku) => {
    navigate('/scenarios');
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold text-[#ffd200]'>Dashboard</h1>
          <p className='text-sm text-[#d1c6ab]'>Real-time category performance and optimization recommendations.</p>
        </div>
        <button 
          onClick={() => navigate('/scenarios')}
          className='px-4 py-2 bg-[#ffd200] text-[#231b00] font-bold rounded hover:bg-[#ecc200] transition-colors flex items-center gap-2'
        >
          <span className='material-symbols-outlined'>bolt</span>
          <span>Optimize Assortment</span>
        </button>
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
        <>
          <KPIGrid kpis={kpis} />
          <SKUPerformanceTable skus={skus} onOptimize={handleOptimize} />
        </>
      )}
    </div>
  );
}

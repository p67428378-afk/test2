import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout.jsx';
import DepartmentalBudgetTable from '../components/variance/DepartmentalBudgetTable.jsx';
import { getBudgetVariance } from '../services/api';

export default function BudgetVariancePage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVariance = async () => {
      try {
        const data = await getBudgetVariance();
        setDepartments(data);
      } catch (err) {
        console.error('Failed to fetch budget variance:', err);
        setError('Failed to load departmental budget variance data.');
      } finally {
        setLoading(false);
      }
    };
    fetchVariance();
  }, []);

  return (
    <AppLayout title="Budget Variance Analysis" subtitle="Departmental budgeted vs. actual spending">
      {loading ? (
        <div className='flex items-center justify-center h-64'>
          <div className='text-headline-md text-on-surface-variant'>Loading budget variance data...</div>
        </div>
      ) : error ? (
        <div className='bg-error-container/20 border border-error/30 text-error p-md rounded-lg text-center'>
          {error}
        </div>
      ) : (
        <DepartmentalBudgetTable departments={departments} />
      )}
    </AppLayout>
  );
}

import React, { useState, useEffect } from 'react';
import KPICard from './KPICard';
import { getKpis } from '../../services/api';
import { DollarSign, Percent, Package, Box } from 'lucide-react';

const KPICardGrid = () => {
  const [kpis, setKpis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getKpis()
      .then(response => {
        setKpis(response.data);
      })
      .catch(error => {
        console.error("Error fetching KPIs:", error);
        setError("Failed to load KPIs. Please try again later.");
      });
  }, []);

  const kpiMetrics = [
    { title: "Sales / Linear Ft", key: "sales_linear_ft", icon: DollarSign, prefix: "$", decimals: 2 },
    { title: "Private Brand %", key: "private_brand_percent", icon: Percent, suffix: "%", decimals: 1 },
    { title: "In-Stock Rate", key: "in_stock_rate", icon: Package, suffix: "%", decimals: 1 },
    { title: "Shelf Capacity", key: "shelf_capacity", icon: Box, suffix: "%", decimals: 0 },
  ];

  if (error) {
    return <div className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiMetrics.map(metric => (
        <KPICard 
          key={metric.key}
          title={metric.title}
          value={kpis ? kpis[metric.key] : null}
          icon={metric.icon}
          prefix={metric.prefix}
          suffix={metric.suffix}
          decimals={metric.decimals}
        />
      ))}
    </div>
  );
};

export default KPICardGrid;

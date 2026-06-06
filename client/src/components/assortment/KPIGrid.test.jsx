import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import KPIGrid from './KPIGrid.jsx';

describe('KPIGrid Component', () => {
  it('renders KPI cards with correct values', () => {
    const mockKPIs = {
      sales_per_linear_ft: 1245.50,
      sales_per_linear_ft_change: 8.2,
      private_brand_percentage: 24.5,
      private_brand_target: 30.0,
      in_stock_rate: 96.8,
      in_stock_target: 95.0,
      shelf_capacity_percentage: 88,
      shelf_capacity_used: 88,
      shelf_capacity_total: 100
    };

    render(<KPIGrid kpis={mockKPIs} />);

    // Check if titles are rendered
    expect(screen.getByText('Sales per Linear Foot')).toBeInTheDocument();
    expect(screen.getByText('Private Brand %')).toBeInTheDocument();
    expect(screen.getByText('In-Stock Rate')).toBeInTheDocument();
    expect(screen.getByText('Shelf Capacity')).toBeInTheDocument();

    // Check if values are formatted and rendered
    expect(screen.getByText('$1,245.50')).toBeInTheDocument();
    expect(screen.getByText('24.5%')).toBeInTheDocument();
    expect(screen.getByText('96.8%')).toBeInTheDocument();
    expect(screen.getByText('88%')).toBeInTheDocument();
  });
});

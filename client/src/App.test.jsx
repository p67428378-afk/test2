import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App.jsx';

// Mock the API services
vi.mock('./services/api.js', () => {
  return {
    getDashboardData: () => Promise.resolve({
      kpis: {
        in_stock_rate: { change: -0.8, unit: '%', value: 94.5 },
        private_brand_pct: { change: 1.5, unit: '%', value: 32 },
        sales_per_linear_ft: { change: 5.2, unit: '$', value: 1250.5 },
        shelf_capacity: { change: 2, unit: '%', value: 85 }
      },
      skus: [
        { name: 'Brand A Potato Chips 10oz', profit_margin: 24.5, sales: 15200, sku_id: 'sku-001', status_badge: 'GROW', units_sold: 4500 }
      ]
    }),
    getScenarioData: () => Promise.resolve({
      actions: [
        { action_type: 'GROW', name: 'Brand A Potato Chips 10oz', sku_id: 'sku-001' }
      ],
      guardrails: [
        { message: 'Private Brand % is 34.5%, which meets the 30% target.', name: 'Private Brand % Goal', status: 'PASSED' }
      ],
      projected_metrics: {
        in_stock_rate: { change: 0.5, unit: '%', value: 95 },
        private_brand_pct: { change: 2.5, unit: '%', value: 34.5 },
        sales_per_linear_ft: { change: 2.4, unit: '$', value: 1280 },
        shelf_capacity: { change: -3, unit: '%', value: 82 }
      },
      scenario_name: 'Balanced'
    }),
    submitAssortment: () => Promise.resolve({
      status: 'SUCCESS',
      audit_trail: {
        scenario_name: 'Balanced',
        submission_id: 'sub-123456',
        summary: 'Assortment submitted successfully.',
        timestamp: '2026-01-01T12:00:00Z',
        user_id: 'category.manager@dollargeneral.com'
      }
    }),
    default: {
      get: () => Promise.resolve({ data: {} }),
      post: () => Promise.resolve({ data: {} }),
      create: () => ({
        get: () => Promise.resolve({ data: {} }),
        post: () => Promise.resolve({ data: {} })
      })
    }
  };
});

describe('App Smoke Test', () => {
  it('renders the loading state initially', () => {
    render(<App />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });
});
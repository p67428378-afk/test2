import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App.jsx';

// Mock the API services
vi.mock('./services/api.js', () => ({
  getKPIs: vi.fn().mockResolvedValue({
    in_stock_rate: 94.2,
    private_brand_pct: 18.5,
    sales_per_linear_ft: 145.5,
    shelf_capacity_utilized: 88.0
  }),
  getSKUs: vi.fn().mockResolvedValue([
    {
      brand: 'Private Brand',
      current_sales: 12500,
      id: 'd3b07384-d113-49c3-a558-1234567890ab',
      in_stock_rate: 96.5,
      name: 'Good & Smart Potato Chips',
      sales_per_linear_ft: 150,
      sku_number: 'SKU-1001',
      status: 'GROW'
    }
  ]),
  getScenarios: vi.fn().mockResolvedValue([
    {
      description: 'Prioritizes minimal changes and stable, core products.',
      id: 'e4c07384-d113-49c3-a558-1234567890ba',
      name: 'Conservative',
      projected_private_brand_pct: 19,
      projected_sales_growth: 2.5,
      projected_shelf_capacity: 85
    }
  ]),
  selectScenario: vi.fn().mockResolvedValue({
    guardrails: {
      private_brand_check: true,
      shelf_capacity_check: true
    },
    projected_kpis: {
      in_stock_rate: 95,
      private_brand_pct: 21.5,
      sales_per_linear_ft: 153.94,
      shelf_capacity_utilized: 90
    },
    proposed_changes: {
      add: 3,
      keep: 15,
      remove: 2,
      swap: 1
    },
    skus: [
      {
        brand: 'Private Brand',
        current_sales: 12500,
        id: 'd3b07384-d113-49c3-a558-1234567890ab',
        in_stock_rate: 96.5,
        name: 'Good & Smart Potato Chips',
        sales_per_linear_ft: 150,
        sku_number: 'SKU-1001',
        status: 'GROW'
      }
    ]
  }),
  submitApproval: vi.fn().mockResolvedValue({
    approved_by: 'Sarah Chen',
    success: true,
    summary: {
      added_skus: 3,
      removed_skus: 2,
      scenario: 'Balanced',
      swapped_skus: 1,
      total_skus: 19
    },
    timestamp: '2026-01-01T12:00:00Z',
    transaction_id: 'TXN-987654321'
  })
}));

describe('DG Cluster Assortment Advisor App', () => {
  it('renders the dashboard page with header and main sections', async () => {
    await act(async () => {
      render(<App />);
    });

    // Verify header title is present
    const headers = screen.getAllByText('DG Cluster Assortment Advisor');
    expect(headers.length).toBeGreaterThan(0);

    // Verify category manager name is present
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
  });
});
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

// Mock the API services
vi.mock('./services/api', () => ({
  getKPIs: vi.fn(() => Promise.resolve({
    in_stock_rate: 94,
    private_brand_pct: 22,
    sales_per_linear_ft: 15.75,
    shelf_capacity: 85,
  })),
  getSKUs: vi.fn(() => Promise.resolve({
    items: [
      {
        id: '11111111-1111-1111-1111-111111111111',
        sku_name: "Lay's Classic 8oz",
        sales_velocity: 145,
        margin_pct: 0.32,
        current_inventory: 450,
        status: 'GROW',
      }
    ],
    limit: 6,
    page: 1,
    total: 1,
  })),
  getScenarios: vi.fn(() => Promise.resolve([
    { name: 'Conservative', sales_lift: 1.2, pb_change: 0.5, is_selected: false },
    { name: 'Balanced', sales_lift: 3.5, pb_change: 2.1, is_selected: true },
    { name: 'Aggressive', sales_lift: 6.8, pb_change: -1.5, is_selected: false },
  ])),
  submitAssortmentPlan: vi.fn(() => Promise.resolve({
    submitted_by: 'Category Manager',
    success: true,
    timestamp: '2026-06-09T15:10:00Z',
    tracking_id: 'audit-8a7d4f3b',
  })),
}));

describe('DG Cluster Assortment Advisor App Smoke Test', () => {
  it('renders the dashboard page without throwing', async () => {
    await act(async () => {
      render(<App />);
    });

    // Check if the header title is present
    expect(screen.getByText('DG Cluster Assortment Advisor')).toBeInTheDocument();

    // Check if the main sections are present
    expect(screen.getByText('SKU Performance')).toBeInTheDocument();
    expect(screen.getByText('Scenario Selection')).toBeInTheDocument();
  });
});

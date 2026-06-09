import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock the API service completely
vi.mock('./services/api', () => {
  const mockKPIs = {
    in_stock_rate: 96.2,
    private_brand_pct: 24.8,
    sales_per_linear_ft: 1520,
    shelf_capacity: 84.5,
  };
  const mockSKUs = {
    items: [
      { sku_id: '1', name: 'Clover Valley Potato Chips 10oz', sales: 12450, profit: 3112, volume: 6225, status: 'GROW' },
      { sku_id: '2', name: 'Brand A Tortilla Chips 12oz', sales: 9800, profit: 2450, volume: 4900, status: 'MAINTAIN' },
    ],
    limit: 10,
    page: 1,
    total: 2,
  };
  const mockScenarios = [
    { id: 's1', name: 'Conservative', description: 'Minimize changes. Projected PB: 24.9%', projected_private_brand_pct: 24.9, projected_profit: 1.2, projected_sales: 1.5 },
    { id: 's2', name: 'Balanced', description: 'Optimal mix of core & new. Projected PB: 25.5%', projected_private_brand_pct: 25.5, projected_profit: 4.1, projected_sales: 3.5 },
  ];
  const mockDetails = {
    scenario_id: 's2',
    name: 'Balanced',
    projected_sales_change_pct: 3.5,
    projected_profit_change_pct: 4.1,
    projected_private_brand_pct: 25.5,
    actions: [
      { sku_id: '2', sku_name: 'Brand B Cheese Puffs', action: 'SWAP' },
    ],
    guardrails: [
      { name: 'Shelf capacity < 100%', passed: true, value: '84.5%' },
      { name: 'PB % meets target', passed: true, value: '25.5% (Target: 25.0%)' },
    ],
  };

  return {
    getKPIs: vi.fn().mockResolvedValue(mockKPIs),
    getSKUs: vi.fn().mockResolvedValue(mockSKUs),
    getScenarios: vi.fn().mockResolvedValue(mockScenarios),
    selectScenario: vi.fn().mockResolvedValue(mockDetails),
    submitApproval: vi.fn().mockResolvedValue({ success: true }),
    default: {
      getKPIs: vi.fn().mockResolvedValue(mockKPIs),
      getSKUs: vi.fn().mockResolvedValue(mockSKUs),
      getScenarios: vi.fn().mockResolvedValue(mockScenarios),
      selectScenario: vi.fn().mockResolvedValue(mockDetails),
      submitApproval: vi.fn().mockResolvedValue({ success: true }),
    }
  };
});

describe('DG Assortment Advisor App Smoke Test', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      render(<App />);
    });

    // Verify main title is present
    expect(screen.getByText('Small Town Value Cluster — Snacks Assortment')).toBeInTheDocument();
  });
});

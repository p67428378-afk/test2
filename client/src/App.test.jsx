import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import api from './services/api';

// Mock the API service
vi.mock('./services/api', () => {
  return {
    default: {
      getKPIs: vi.fn().mockResolvedValue({
        sales_per_linear_ft: 125.5,
        sales_trend_pct: 4.2,
        private_brand_pct: 22.4,
        in_stock_rate: 94.1,
        shelf_capacity_pct: 88.0,
      }),
      getSKUs: vi.fn().mockResolvedValue([
        { sku: 'SKU-1001', name: "Lay's Classic Chips 10oz", sales_volume: 5420, sales_trend: 5.1, status: 'MAINTAIN' },
        { sku: 'SKU-1002', name: 'Clover Valley Potato Chips 10oz', sales_volume: 6120, sales_trend: 15.4, status: 'GROW' },
      ]),
      getScenarioDetails: vi.fn().mockResolvedValue({
        scenario_name: 'balanced',
        actions: { add: 15, remove: 22, keep: 463 },
        guardrails: {
          private_brand_passed: true,
          sku_count_passed: true,
          message: 'All guardrails passed.',
        },
        projected_private_brand_pct: 26.5,
        projected_sales: 135000,
        projected_shelf_capacity_pct: 85,
        sku_action_list: [{ sku: 'SKU-1001', action: 'KEEP' }],
      }),
      submitAssortmentPlan: vi.fn().mockResolvedValue({
        id: 'plan-123',
        audit_trail_id: '4a2b3c4d-5e6f-7g8h-9i0j',
        guardrails_passed: true,
        projected_private_brand_pct: 26.5,
        projected_sales: 135000,
        scenario_name: 'balanced',
        submitted_at: '2026-05-18T14:30:00Z',
        submitted_by: 'John Doe',
        summary: '15 added, 22 removed, 463 maintained',
      }),
    },
  };
});

describe('DG Cluster Assortment Advisor Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the dashboard layout and main sections', async () => {
    render(<App />);

    // Check header title
    expect(screen.getByText(/Small Town Value Cluster — Snacks Assortment Advisor/i)).toBeInTheDocument();

    // Check sidebar elements
    expect(screen.getByText('DG Assortment')).toBeInTheDocument();

    // Wait for KPIs to load and verify
    await waitFor(() => {
      expect(screen.getByText('$125.50')).toBeInTheDocument();
    });

    // Verify SKU table headers
    expect(screen.getByText('Snacks SKU Performance')).toBeInTheDocument();
    expect(screen.getByText("Lay's Classic Chips 10oz")).toBeInTheDocument();

    // Verify Scenario Selector
    expect(screen.getByText('Scenario Selector')).toBeInTheDocument();
    expect(screen.getByText('Balanced')).toBeInTheDocument();

    // Verify Review Panel
    expect(screen.getByText(/Review: balanced/i)).toBeInTheDocument();
  });

  it('allows selecting a different scenario and submitting the plan', async () => {
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('$125.50')).toBeInTheDocument();
    });

    // Click on Conservative scenario
    const conservativeCard = screen.getByText('Conservative');
    fireEvent.click(conservativeCard);

    // Verify scenario selection triggers API call
    await waitFor(() => {
      expect(api.getScenarioDetails).toHaveBeenCalledWith('conservative');
    });

    // Click submit button
    const submitButton = screen.getByRole('button', { name: /Submit Assortment Plan/i });
    fireEvent.click(submitButton);

    // Verify submit API call
    await waitFor(() => {
      expect(api.submitAssortmentPlan).toHaveBeenCalled();
    });

    // Verify success modal is displayed
    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('4a2b3c4d-5e6f-7g8h-9i0j')).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByRole('button', { name: /Close/i });
    fireEvent.click(closeButton);

    // Verify modal is closed
    expect(screen.queryByText('Success!')).not.toBeInTheDocument();
  });
});

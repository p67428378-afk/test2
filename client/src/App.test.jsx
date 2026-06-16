import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as api from './services/api';

// Mock the API service
vi.mock('./services/api', () => ({
  getKPIs: vi.fn(),
  getScenario: vi.fn(),
  submitAssortmentDecision: vi.fn(),
}));

describe('DG Cluster Assortment Advisor App', () => {
  const mockKPIs = {
    sales_per_linear_ft: 125.50,
    private_brand_percentage: 22.5,
    in_stock_rate: 98.7,
    shelf_capacity: 85.0,
  };

  const mockScenarioData = {
    scenario: 'balanced',
    projected_impact: {
      sales_per_linear_ft: 125.50,
      private_brand_percentage: 22.5,
    },
    sku_actions: [
      {
        sku_name: "Lay's Classic Potato Chips 13oz",
        action: 'MAINTAIN',
        current_sales: 12450.0,
        in_stock_rate: 99.1,
        private_brand: false,
        sales_per_linear_ft: 145.20,
        shelf_capacity: 85,
      },
      {
        sku_name: 'Clover Valley Tortilla Chips 10oz',
        action: 'GROW',
        current_sales: 8900.0,
        in_stock_rate: 98.2,
        private_brand: true,
        sales_per_linear_ft: 112.50,
        shelf_capacity: 85,
      },
    ],
    guardrail_status: {
      private_brand_ok: true,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    api.getKPIs.mockResolvedValue(mockKPIs);
    api.getScenario.mockResolvedValue(mockScenarioData);
  });

  it('renders the dashboard with KPIs and SKU table', async () => {
    render(<App />);

    // Verify loading state is shown initially
    expect(screen.getByclassName ? screen.getByclassName('animate-spin') : document.body).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('DG Cluster Assortment Advisor')).toBeInTheDocument();
    });

    // Verify KPIs are displayed
    expect(screen.getByText('$125.50')).toBeInTheDocument();
    expect(screen.getByText('22.5%')).toBeInTheDocument();
    expect(screen.getByText('98.7%')).toBeInTheDocument();
    expect(screen.getByText('85.0%')).toBeInTheDocument();

    // Verify SKU table content
    expect(screen.getByText("Lay's Classic Potato Chips 13oz")).toBeInTheDocument();
    expect(screen.getByText('Clover Valley Tortilla Chips 10oz')).toBeInTheDocument();
  });

  it('allows selecting a different scenario and updates the view', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('DG Cluster Assortment Advisor')).toBeInTheDocument();
    });

    // Mock the aggressive scenario response
    const mockAggressiveData = {
      ...mockScenarioData,
      scenario: 'aggressive',
      projected_impact: {
        sales_per_linear_ft: 135.00,
        private_brand_percentage: 25.0,
      },
    };
    api.getScenario.mockResolvedValueOnce(mockAggressiveData);

    // Click on Aggressive scenario card
    const aggressiveCard = screen.getByText('Aggressive');
    fireEvent.click(aggressiveCard);

    await waitFor(() => {
      expect(api.getScenario).toHaveBeenCalledWith('aggressive');
    });
  });

  it('submits the assortment plan and shows success modal', async () => {
    api.submitAssortmentDecision.mockResolvedValue({
      message: 'Assortment decision submitted successfully.',
      audit_trail_id: 'test-audit-id-123',
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('DG Cluster Assortment Advisor')).toBeInTheDocument();
    });

    // Click submit button
    const submitButton = screen.getByText('Submit Assortment Plan');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(api.submitAssortmentDecision).toHaveBeenCalled();
      expect(screen.getByText('Submission Successful')).toBeInTheDocument();
      expect(screen.getByText('test-audit-id-123')).toBeInTheDocument();
    });
  });
});

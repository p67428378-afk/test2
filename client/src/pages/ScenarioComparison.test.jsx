import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ScenarioComparison from './ScenarioComparison';

// Mock the API services
vi.mock('../services/api', () => ({
  getScenarios: vi.fn(() => Promise.resolve([
    {
      id: 'conservative',
      name: 'Conservative',
      description: 'Focus on low-risk optimization.',
      projected_sales_lift: 1.5,
      new_private_brand_pct: 38.0,
      shelf_space_impact_ft: -2.0,
      is_selected: false,
      items_to_add: [],
      items_to_remove: [
        { sku: 'CV-TOR-05', name: 'Clover Valley Tortilla Chips 13oz' }
      ],
    },
    {
      id: 'balanced',
      name: 'Balanced',
      description: 'Optimize assortment.',
      projected_sales_lift: 4.5,
      new_private_brand_pct: 44.1,
      shelf_space_impact_ft: 0.0,
      is_selected: true,
      items_to_add: [
        { sku: 'CV-PST-08', name: 'Clover Valley Pistachios 8oz', is_private_brand: true, shelf_space: 2.0 }
      ],
      items_to_remove: [
        { sku: 'CV-TOR-05', name: 'Clover Valley Tortilla Chips 13oz' }
      ],
    }
  ])),
  selectScenario: vi.fn(() => Promise.resolve({ success: true })),
}));

describe('ScenarioComparison Component', () => {
  it('renders loading state initially', () => {
    render(<ScenarioComparison />);
    expect(screen.getByText(/Loading scenarios.../i)).toBeInTheDocument();
  });

  it('renders scenarios and allows selection', async () => {
    render(<ScenarioComparison />);

    await waitFor(() => {
      expect(screen.queryByText(/Loading scenarios.../i)).not.toBeInTheDocument();
    });

    expect(screen.getByText('Conservative')).toBeInTheDocument();
    expect(screen.getByText('Balanced')).toBeInTheDocument();

    // Conservative select button should be enabled
    const selectButtons = screen.getAllByRole('button', { name: /Select Scenario|Currently Selected/i });
    expect(selectButtons[0]).toHaveTextContent('Select Scenario');
    expect(selectButtons[1]).toHaveTextContent('Currently Selected');

    // Click select on Conservative
    fireEvent.click(selectButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Successfully selected the Conservative scenario!/i)).toBeInTheDocument();
    });
  });
});

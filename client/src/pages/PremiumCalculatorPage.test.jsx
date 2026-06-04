import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PremiumCalculatorPage from './PremiumCalculatorPage';
import * as api from '../services/api';

// Mock the api service
vi.mock('../services/api');

describe('PremiumCalculatorPage', () => {
  it('renders the form and display sections', () => {
    render(<PremiumCalculatorPage />);
    expect(screen.getByText('Calculate Your Premium')).toBeInTheDocument();
    expect(screen.getByText('Your Estimated Premium')).toBeInTheDocument();
  });

  it('allows filling the form and calculating premium', async () => {
    const mockPremiumData = {
      base_premium: 500,
      ncb_discount: 150,
      premium_after_ncb: 350,
      final_premium: 420,
    };
    api.calculatePremium.mockResolvedValue(mockPremiumData);

    render(<PremiumCalculatorPage />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Age'), { target: { value: '35' } });
    fireEvent.change(screen.getByLabelText('Claim-Free Years'), { target: { value: '5' } });

    // Click calculate
    fireEvent.click(screen.getByRole('button', { name: /Calculate Premium/i }));

    // Wait for the API call and state update
    await waitFor(() => {
      expect(api.calculatePremium).toHaveBeenCalled();
    });

    // Check if the premium display is updated
    await waitFor(() => {
        expect(screen.getByText(/\$420.00/)).toBeInTheDocument();
    });

    // Check if policy details are shown
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});

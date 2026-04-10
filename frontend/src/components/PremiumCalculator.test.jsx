import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PremiumCalculator from './PremiumCalculator';
import * as api from '../services/api';

describe('PremiumCalculator', () => {
  it('renders the calculator', () => {
    render(<PremiumCalculator />);
    expect(screen.getByText('Premium Calculator')).toBeInTheDocument();
  });

  it('updates base rate when input changes', () => {
    render(<PremiumCalculator />);
    const baseRateInput = screen.getByLabelText('Base Rate');
    fireEvent.change(baseRateInput, { target: { value: '600' } });
    expect(baseRateInput.value).toBe('600');
  });

  it('updates claim free years when button is clicked', () => {
    render(<PremiumCalculator />);
    const ncbButton = screen.getByText('4 Yr');
    fireEvent.click(ncbButton);
    // Add assertion to check if the claim free years state is updated
  });

  it('updates vehicle multiplier when slider changes', () => {
    render(<PremiumCalculator />);
    const multiplierSlider = screen.getByLabelText('Vehicle Multiplier');
    fireEvent.change(multiplierSlider, { target: { value: '1.5' } });
    expect(multiplierSlider.value).toBe('1.5');
  });

  it('calls the api and displays the premium', async () => {
    const calculatePremiumSpy = vi.spyOn(api, 'calculatePremium');
    calculatePremiumSpy.mockResolvedValue({ premium: 500 });

    render(<PremiumCalculator />);

    const baseRateInput = screen.getByLabelText('Base Rate');
    fireEvent.change(baseRateInput, { target: { value: '600' } });

    await waitFor(() => {
        expect(calculatePremiumSpy).toHaveBeenCalled();
        expect(screen.getByText(/500.00/)).toBeInTheDocument();
    });
  });
});

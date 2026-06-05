import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CalculatorPage from './CalculatorPage';
import * as api from '../services/api';

vi.mock('../services/api');

describe('CalculatorPage', () => {
  it('renders the calculator form and handles premium calculation', async () => {
    api.calculatePremium.mockResolvedValue({ calculated_premium: 500 });

    render(<CalculatorPage />);

    fireEvent.change(screen.getByLabelText('Vehicle Value ($)'), { target: { value: '30000' } });
    fireEvent.click(screen.getByText('Calculate Premium'));

    await waitFor(() => {
      expect(api.calculatePremium).toHaveBeenCalledWith({
        vehicle_value: 30000,
        ncb_percentage: 20,
        vehicle_multiplier: 1.0,
      });
      expect(screen.getByText(/\$500.00 \/ year/)).toBeInTheDocument();
    });
  });
});

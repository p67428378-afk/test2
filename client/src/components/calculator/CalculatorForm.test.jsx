import { render, screen, fireEvent } from '@testing-library/react';
import CalculatorForm from './CalculatorForm';

describe('CalculatorForm', () => {
  it('renders and captures user input', () => {
    const handleCalculate = vi.fn();
    render(<CalculatorForm onCalculate={handleCalculate} />);

    fireEvent.change(screen.getByLabelText('Vehicle Value ($)'), { target: { value: '28000' } });
    fireEvent.change(screen.getByLabelText('No Claims Bonus (NCB)'), { target: { value: '35' } });
    fireEvent.change(screen.getByLabelText('Vehicle Type'), { target: { value: 'suv' } });

    fireEvent.click(screen.getByText('Calculate Premium'));

    expect(handleCalculate).toHaveBeenCalledWith({
      vehicle_value: 28000,
      ncb_percentage: 35,
      vehicle_multiplier: 1.2,
    });
  });
});

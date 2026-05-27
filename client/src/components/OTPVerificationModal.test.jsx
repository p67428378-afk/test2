import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OTPVerificationModal from './OTPVerificationModal';

describe('OTPVerificationModal', () => {
  it('renders the modal correctly', () => {
    render(<OTPVerificationModal />);
    expect(screen.getByText('Verify Card Ownership')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Verify OTP/i })).toBeInTheDocument();
  });

  it('calls onSubmit with the entered OTP', () => {
    const handleSubmit = vi.fn();
    render(<OTPVerificationModal onSubmit={handleSubmit} />);

    const inputs = screen.getAllByRole('textbox');
    fireEvent.change(inputs[0], { target: { value: '1' } });
    fireEvent.change(inputs[1], { target: { value: '2' } });
    fireEvent.change(inputs[2], { target: { value: '3' } });
    fireEvent.change(inputs[3], { target: { value: '4' } });
    fireEvent.change(inputs[4], { target: { value: '5' } });
    fireEvent.change(inputs[5], { target: { value: '6' } });

    fireEvent.click(screen.getByRole('button', { name: /Verify OTP/i }));

    expect(handleSubmit).toHaveBeenCalledWith('123456');
  });
});

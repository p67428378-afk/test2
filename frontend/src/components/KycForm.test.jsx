import { render, screen } from '@testing-library/react';
import KycForm from './KycForm';

describe('KycForm', () => {
  it('renders the form', () => {
    render(<KycForm />);
    expect(screen.getByText('KYC Form')).toBeInTheDocument();
  });
});

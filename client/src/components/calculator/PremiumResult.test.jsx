import { render, screen } from '@testing-library/react';
import PremiumResult from './PremiumResult';

describe('PremiumResult', () => {
  it('does not render when premium is null', () => {
    const { container } = render(<PremiumResult premium={null} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders the premium when provided', () => {
    render(<PremiumResult premium={1234.56} />);
    expect(screen.getByText(/\$1,234.56 \/ year/)).toBeInTheDocument();
  });
});

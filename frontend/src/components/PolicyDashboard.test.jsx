import { render, screen } from '@testing-library/react';
import PolicyDashboard from './PolicyDashboard';

describe('PolicyDashboard', () => {
  it('should render the main dashboard title', () => {
    render(<PolicyDashboard />);
    expect(screen.getByText(/Elite Platinum Plus/i)).toBeInTheDocument();
  });
});
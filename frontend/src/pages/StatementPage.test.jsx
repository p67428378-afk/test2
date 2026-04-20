import { render, screen } from '@testing-library/react';
import StatementPage from './StatementPage';

it('renders statement page', () => {
  render(<StatementPage />);
  const linkElement = screen.getByText(/Bank Account Statement/i);
  expect(linkElement).toBeInTheDocument();
});

import { render, screen } from '@testing-library/react';
import App from './App';

it('renders the main application header', () => {
  render(<App />);
  const headerElement = screen.getByText(/The Architectural Trust/i);
  expect(headerElement).toBeInTheDocument();
});

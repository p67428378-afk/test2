import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Verification Pipeline header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Verification Pipeline/i);
  expect(headerElement).toBeInTheDocument();
});

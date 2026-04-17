import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the main application component', () => {
    render(<App />);
    const headerElement = screen.getByText(/Verification Pipeline/i);
    expect(headerElement).toBeInTheDocument();
  });
});

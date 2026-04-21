import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the main application component', () => {
    render(<App />);
    const linkElement = screen.getByText(/Update Security Contact/i);
    expect(linkElement).toBeInTheDocument();
  });
});

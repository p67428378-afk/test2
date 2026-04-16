import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the main application', () => {
    render(<App />);
    const header = screen.getByText('The Editorial Health Portal');
    expect(header).toBeInTheDocument();
  });
});

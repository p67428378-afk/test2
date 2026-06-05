import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the main application page', () => {
    render(<App />);
    expect(screen.getByText('SureDrive Insurance')).toBeInTheDocument();
    expect(screen.getByText('Insurance Premium Calculator')).toBeInTheDocument();
  });
});

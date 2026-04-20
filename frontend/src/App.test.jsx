import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the initial count and button', () => {
    render(<App />);
    expect(screen.getByText('Counter')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('Increment')).toBeInTheDocument();
  });

  it('increments the count when the button is clicked', async () => {
    render(<App />);
    const incrementButton = screen.getByText('Increment');
    fireEvent.click(incrementButton);
    // After clicking, the count should be 1. We need to handle the async nature of the state update.
    // For this simple case, we can just check the updated value.
    // In a real app with API calls, we would mock the API and wait for the update.
    expect(await screen.findByText('1')).toBeInTheDocument();
  });
});

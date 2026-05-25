import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the card comparison page by default', () => {
    render(<App />);
    expect(screen.getByText('Compare Cards')).toBeInTheDocument();
  });

  it('navigates to the application page when an apply button is clicked', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Apply Now'));
    expect(screen.getByText('Secure Application')).toBeInTheDocument();
  });

  it('navigates back to the comparison page from the application page', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Apply Now')); // Go to application page
    fireEvent.click(screen.getByLabelText('Back')); // Assuming there is a back button with this aria-label
    expect(screen.getByText('Compare Cards')).toBeInTheDocument();
  });
});

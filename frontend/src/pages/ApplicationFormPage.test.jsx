import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import ApplicationFormPage from './ApplicationFormPage';

describe('ApplicationFormPage', () => {
  it('renders the form', () => {
    render(
      <Router>
        <ApplicationFormPage />
      </Router>
    );

    expect(screen.getByText('Elevate your financial journey.')).toBeInTheDocument();
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Application/i })).toBeInTheDocument();
  });

  it('updates form data on input change', () => {
    render(
      <Router>
        <ApplicationFormPage />
      </Router>
    );

    const firstNameInput = screen.getByLabelText('First Name');
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    expect(firstNameInput.value).toBe('John');
  });
});

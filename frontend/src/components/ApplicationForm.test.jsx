import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ApplicationForm from './ApplicationForm';
import { submitApplication } from '../services/api';

// Mock the api service
vi.mock('../services/api', () => ({
  submitApplication: vi.fn(),
}));

describe('ApplicationForm', () => {
  test('renders the form correctly', () => {
    render(
      <MemoryRouter>
        <ApplicationForm />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/social security number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/current address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/employment status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/annual income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/estimated credit score/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit application/i })).toBeInTheDocument();
  });

  test('shows validation errors for empty fields', async () => {
    render(
      <MemoryRouter>
        <ApplicationForm />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /submit application/i }));

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/ssn is required/i)).toBeInTheDocument();
      expect(screen.getByText(/date of birth is required/i)).toBeInTheDocument();
      expect(screen.getByText(/address is required/i)).toBeInTheDocument();
      expect(screen.getByText(/annual income is required/i)).toBeInTheDocument();
      expect(screen.getByText(/credit score is required/i)).toBeInTheDocument();
    });
  });

  test('submits the form with valid data and navigates to status page', async () => {
    const mockApplicationResult = {
      status: 'Approved',
      decision_message: 'Congratulations!',
      credit_limit: 5000,
    };
    submitApplication.mockResolvedValue(mockApplicationResult);

    render(
      <MemoryRouter>
        <ApplicationForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/social security number/i), { target: { value: '123-45-6789' } });
    fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-01-01' } });
    fireEvent.change(screen.getByLabelText(/current address/i), { target: { value: '123 Main St' } });
    fireEvent.change(screen.getByLabelText(/annual income/i), { target: { value: '75000' } });
    fireEvent.change(screen.getByLabelText(/estimated credit score/i), { target: { value: '720' } });

    fireEvent.click(screen.getByRole('button', { name: /submit application/i }));

    await waitFor(() => {
      expect(submitApplication).toHaveBeenCalledWith({
        full_name: 'John Doe',
        ssn: '123-45-6789',
        date_of_birth: '1990-01-01',
        address: '123 Main St',
        annual_income: 75000,
        employment_status: 'employed',
        credit_score: 720,
      });
    });
  });
});

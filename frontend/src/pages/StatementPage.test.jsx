
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatementPage from './StatementPage';
import { generateStatement } from '../services/api';

// Mock the api service
jest.mock('../services/api');

describe('StatementPage', () => {
  test('renders the initial step correctly', () => {
    render(<StatementPage />);
    expect(screen.getByText('Download Statements')).toBeInTheDocument();
    expect(screen.getByLabelText('Account Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByLabelText('End Date')).toBeInTheDocument();
    expect(screen.getByText('Fetch Statement')).toBeInTheDocument();
  });

  test('fetches and displays statement preview', async () => {
    const mockStatement = {
      account_number: '1234567890',
      start_date: '2023-01-01',
      end_date: '2023-01-31',
      opening_balance: 1000,
      closing_balance: 3300,
      transactions: [
        { id: '1', date: '2023-01-05', description: 'Salary', amount: 5000, type: 'credit' },
        { id: '2', date: '2023-01-10', description: 'Rent', amount: 1500, type: 'debit' },
      ],
    };
    generateStatement.mockResolvedValue(mockStatement);

    render(<StatementPage />);

    fireEvent.click(screen.getByText('Fetch Statement'));

    await waitFor(() => {
      expect(screen.getByText('Statement Preview')).toBeInTheDocument();
      expect(screen.getByText('€1,000')).toBeInTheDocument();
      expect(screen.getByText('€3,300')).toBeInTheDocument();
      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.getByText('Rent')).toBeInTheDocument();
    });
  });

  test('shows download options and handles download', async () => {
    const mockStatement = {
        account_number: '1234567890',
        start_date: '2023-01-01',
        end_date: '2023-01-31',
        opening_balance: 1000,
        closing_balance: 3300,
        transactions: [],
      };
      generateStatement.mockResolvedValue(mockStatement);
  
      render(<StatementPage />);
  
      // Go to statement preview
      fireEvent.click(screen.getByText('Fetch Statement'));
      await waitFor(() => expect(screen.getByText('Statement Preview')).toBeInTheDocument());

      // Go to download options
      fireEvent.click(screen.getByText('Download Options'));
      await waitFor(() => expect(screen.getByText('Download Statement')).toBeInTheDocument());

    // Click PDF download
    fireEvent.click(screen.getByText('Download as PDF'));

    await waitFor(() => {
      expect(generateStatement).toHaveBeenCalledWith('1234567890', '2023-01-01', '2023-01-31', 'pdf');
    });

    // Should go to success screen
    await waitFor(() => expect(screen.getByText('Download Complete')).toBeInTheDocument());
  });

  test('goes back to step 1 from success screen', async () => {
    const mockStatement = {
        account_number: '1234567890',
        start_date: '2023-01-01',
        end_date: '2023-01-31',
        opening_balance: 1000,
        closing_balance: 3300,
        transactions: [],
      };
      generateStatement.mockResolvedValue(mockStatement);
  
      render(<StatementPage />);
  
      // Go to statement preview
      fireEvent.click(screen.getByText('Fetch Statement'));
      await waitFor(() => expect(screen.getByText('Statement Preview')).toBeInTheDocument());

      // Go to download options
      fireEvent.click(screen.getByText('Download Options'));
      await waitFor(() => expect(screen.getByText('Download Statement')).toBeInTheDocument());

    // Click PDF download
    fireEvent.click(screen.getByText('Download as PDF'));
    await waitFor(() => expect(screen.getByText('Download Complete')).toBeInTheDocument());

    // Click Done
    fireEvent.click(screen.getByText('Done'));
    await waitFor(() => expect(screen.getByText('Download Statements')).toBeInTheDocument());

  });
});

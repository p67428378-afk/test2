import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BalanceCertificateForm from '../components/BalanceCertificateForm';
import * as api from '../services/api';

// Mock the api module
vi.mock('../services/api');

describe('BalanceCertificateForm', () => {
  it('renders the form correctly', () => {
    render(<BalanceCertificateForm />);
    expect(screen.getByLabelText(/account number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/purpose of certificate/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate certificate/i })).toBeInTheDocument();
  });

  it('calls the api on form submission', async () => {
    const setCertificate = vi.fn();
    const setError = vi.fn();
    const setLoading = vi.fn();
    const mockPdfBlob = new Blob(['fake pdf content'], { type: 'application/pdf' });
    api.generateCertificate.mockResolvedValue(mockPdfBlob);

    render(
      <BalanceCertificateForm
        setCertificate={setCertificate}
        setError={setError}
        setLoading={setLoading}
        loading={false}
      />
    );

    fireEvent.change(screen.getByLabelText(/account number/i), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText(/purpose of certificate/i), { target: { value: 'LOAN' } });
    fireEvent.click(screen.getByRole('button', { name: /generate certificate/i }));

    expect(setLoading).toHaveBeenCalledWith(true);
    await vi.waitFor(() => {
      expect(api.generateCertificate).toHaveBeenCalledWith({
        accountNumber: '12345',
        purpose: 'LOAN',
      });
    });
  });
});

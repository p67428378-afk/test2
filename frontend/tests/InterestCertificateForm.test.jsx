import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import InterestCertificateForm from '../src/components/InterestCertificateForm';
import api from '../src/services/api';
import { vi } from 'vitest';

// Mock the api module
vi.mock('../src/services/api');

describe('InterestCertificateForm', () => {
  it('renders the form correctly', () => {
    render(<InterestCertificateForm />);

    expect(screen.getByLabelText('Customer ID')).toBeInTheDocument();
    expect(screen.getByLabelText('Financial Year')).toBeInTheDocument();
    expect(screen.getByText('Generate Certificate')).toBeInTheDocument();
  });

  it('handles successful form submission', async () => {
    const mockPdfBlob = new Blob(['mock pdf content'], { type: 'application/pdf' });
    api.generateInterestCertificate.mockResolvedValue({ data: mockPdfBlob });

    // Mock URL.createObjectURL and anchor element
    window.URL.createObjectURL = vi.fn(() => 'mock-pdf-url');
    const anchorMock = { href: '', download: '', click: vi.fn(), remove: vi.fn() };
    document.createElement = vi.fn(() => anchorMock);
    document.body.appendChild = vi.fn();

    render(<InterestCertificateForm />);

    fireEvent.click(screen.getByText('Generate Certificate'));

    await waitFor(() => {
      expect(api.generateInterestCertificate).toHaveBeenCalledWith('BS-99482103', '2023-24');
      expect(anchorMock.click).toHaveBeenCalled();
    });
  });

  it('handles form submission error', async () => {
    const errorMessage = 'Customer not found';
    api.generateInterestCertificate.mockRejectedValue({ response: { data: { detail: errorMessage } } });

    render(<InterestCertificateForm />);

    fireEvent.click(screen.getByText('Generate Certificate'));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});

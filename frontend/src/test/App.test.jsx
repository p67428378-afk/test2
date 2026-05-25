import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders the main application container', () => {
    render(<App />);
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
  });

  it('renders the TopNavBar component', () => {
    render(<App />);
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
  });

  it('renders the SideNavBar component', () => {
    render(<App />);
    const asideElement = screen.getByRole('complementary');
    expect(asideElement).toBeInTheDocument();
  });

  it('renders the AadhaarInput component', () => {
    render(<App />);
    const aadhaarElement = screen.getByText('Aadhaar Verification');
    expect(aadhaarElement).toBeInTheDocument();
  });

  it('renders the PanInput component', () => {
    render(<App />);
    const panElement = screen.getByText('PAN Validation');
    expect(panElement).toBeInTheDocument();
  });

  it('renders the StatusIndicator component', () => {
    render(<App />);
    const statusElement = screen.getByText('KYC STATUS: APPROVED');
    expect(statusElement).toBeInTheDocument();
  });

  it('renders the AuditTrail component', () => {
    render(<App />);
    const auditElement = screen.getByText('Verification Audit Trail');
    expect(auditElement).toBeInTheDocument();
  });
});

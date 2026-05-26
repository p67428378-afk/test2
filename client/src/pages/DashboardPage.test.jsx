import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';

// Mock child components to isolate the page
vi.mock('../components/OverviewCard', () => ({ 
  default: ({ title }) => <div data-testid="overview-card">{title}</div> 
}));
vi.mock('../components/DeadlineTable', () => ({ 
  default: () => <div data-testid="deadline-table">Deadline Table</div> 
}));
vi.mock('../components/EngagementChart', () => ({ 
  default: () => <div data-testid="engagement-chart">Engagement Chart</div> 
}));
vi.mock('../components/SocialMediaIntegrationCard', () => ({ 
  default: ({ account }) => <div data-testid="social-card">{account.platform}</div> 
}));

describe('DashboardPage', () => {
  it('renders all main sections', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    // Check for overview cards
    const overviewCards = screen.getAllByTestId('overview-card');
    expect(overviewCards).toHaveLength(3);
    expect(screen.getByText('Active Campaigns')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Deadlines')).toBeInTheDocument();
    expect(screen.getByText('Avg. Engagement Rate')).toBeInTheDocument();

    // Check for other sections
    expect(screen.getByTestId('deadline-table')).toBeInTheDocument();
    expect(screen.getByTestId('engagement-chart')).toBeInTheDocument();
    expect(screen.getByText('Connected Social Media Accounts')).toBeInTheDocument();
    
    const socialCards = screen.getAllByTestId('social-card');
    expect(socialCards).toHaveLength(3);
  });
});

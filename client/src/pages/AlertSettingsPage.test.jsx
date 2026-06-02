
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AlertSettingsPage from './AlertSettingsPage';
import { BrowserRouter as Router } from 'react-router-dom';

describe('AlertSettingsPage', () => {
  it('renders the alert settings page', () => {
    render(<Router><AlertSettingsPage /></Router>);
    expect(screen.getByText('Alert Settings')).toBeInTheDocument();
  });
});

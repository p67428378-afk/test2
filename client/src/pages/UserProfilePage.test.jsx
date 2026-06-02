
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import UserProfilePage from './UserProfilePage';
import { BrowserRouter as Router } from 'react-router-dom';

describe('UserProfilePage', () => {
  it('renders the user profile page', () => {
    render(<Router><UserProfilePage /></Router>);
    expect(screen.getByText('User Profile')).toBeInTheDocument();
  });
});


import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProfileDetails from './ProfileDetails';

describe('ProfileDetails', () => {
  it('renders the profile details', () => {
    render(<ProfileDetails />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});

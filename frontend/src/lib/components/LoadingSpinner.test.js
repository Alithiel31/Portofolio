import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import LoadingSpinner from './LoadingSpinner.svelte';

describe('LoadingSpinner', () => {
  it('renders an accessible status region with the default message', () => {
    render(LoadingSpinner);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAccessibleName('Chargement du portfolio…');
    expect(screen.getByText('Chargement du portfolio…')).toBeInTheDocument();
  });

  it('renders a custom message when provided', () => {
    render(LoadingSpinner, { props: { message: 'Loading…' } });
    expect(screen.getByRole('status')).toHaveAccessibleName('Loading…');
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });
});

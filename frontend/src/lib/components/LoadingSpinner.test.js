import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { locale } from '../stores/locale.svelte.js';
import LoadingSpinner from './LoadingSpinner.svelte';

describe('LoadingSpinner', () => {
  beforeEach(() => {
    locale.set('en');
  });

  it('renders an accessible status region with a localized default message', () => {
    render(LoadingSpinner);
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAccessibleName('Loading portfolio…');
    expect(screen.getByText('Loading portfolio…')).toBeInTheDocument();
  });

  it('follows the current locale for its default message', () => {
    locale.set('fr');
    render(LoadingSpinner);
    expect(screen.getByRole('status')).toHaveAccessibleName('Chargement du portfolio…');
  });

  it('renders a custom message when provided', () => {
    render(LoadingSpinner, { props: { message: 'Loading…' } });
    expect(screen.getByRole('status')).toHaveAccessibleName('Loading…');
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });
});

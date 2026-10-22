import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { locale } from '../stores/locale.svelte.js';
import ContactSection from './ContactSection.svelte';

async function fillForm() {
  await fireEvent.input(screen.getByLabelText('Name'), { target: { value: 'Alice' } });
  await fireEvent.input(screen.getByLabelText('Email'), { target: { value: 'alice@example.com' } });
  await fireEvent.input(screen.getByLabelText('Message'), { target: { value: 'Hello there' } });
}

function submit() {
  return fireEvent.click(screen.getByRole('button', { name: /send a message/i }));
}

describe('ContactSection', () => {
  beforeEach(() => {
    locale.set('en');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('keeps an empty live region in the DOM before any submission', () => {
    render(ContactSection, { props: { profile: null } });
    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toBeEmptyDOMElement();
  });

  it('posts the form with the honeypot and the fill delay, then announces success', async () => {
    const fetchMock = vi.fn((_url, _init) => Promise.resolve(new Response('{}', { status: 200 })));
    vi.stubGlobal('fetch', fetchMock);
    render(ContactSection, { props: { profile: null } });

    await fillForm();
    await submit();

    const region = screen.getByRole('status');
    await waitFor(() =>
      expect(region).toHaveTextContent("Message sent! I'll get back to you soon."),
    );
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/contact');
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
      name: 'Alice',
      email: 'alice@example.com',
      message: 'Hello there',
      website: '',
    });
    expect(typeof body.elapsedMs).toBe('number');
    // Champs vidés après succès.
    expect(screen.getByLabelText('Name')).toHaveValue('');
  });

  it('announces an error when the API refuses the message', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() => Promise.resolve(new Response('{}', { status: 500 }))),
    );
    render(ContactSection, { props: { profile: null } });

    await fillForm();
    await submit();

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent(/something went wrong/i),
    );
    expect(screen.getByLabelText('Name')).toHaveValue('Alice');
  });

  it('disables the submit button while the message is being sent', async () => {
    /** @type {(value: Response) => void} */
    let resolve = () => {};
    vi.stubGlobal(
      'fetch',
      vi.fn(() => new Promise((r) => (resolve = r))),
    );
    render(ContactSection, { props: { profile: null } });

    await fillForm();
    await submit();

    const button = screen.getByRole('button', { name: /sending/i });
    expect(button).toBeDisabled();
    resolve(new Response('{}', { status: 200 }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /send a message/i })).toBeEnabled(),
    );
  });

  it('hides the honeypot field from people and assistive technology', () => {
    const { container } = render(ContactSection, { props: { profile: null } });
    const honeypot = container.querySelector('#website');
    expect(honeypot).toHaveAttribute('tabindex', '-1');
    expect(honeypot.closest('[aria-hidden="true"]')).not.toBeNull();
    // Absent de l'arbre d'accessibilité : aucun champ « Website » n'est exposé.
    expect(screen.queryByRole('textbox', { name: 'Website' })).toBeNull();
  });
});

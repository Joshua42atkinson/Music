// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : EmailCapture.test.jsx                                ║
// ║ WHAT    : Unit tests for email capture form                    ║
// ║ WHY     : Form must validate, show success, persist to storage ║
// ╚═══════════════════════════════════════════════════════════════╝

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Mock useLocale
vi.mock('../../hooks/useLocale', () => ({
  useLocale: () => ({
    t: (key) => key,
    isFrench: false,
    locale: 'en',
  }),
}));

// Mock storage
vi.mock('../../lib/storage', () => ({
  vvSet: vi.fn(),
  vvGet: vi.fn(() => null),
}));

vi.mock('../../lib/storageKeys', () => ({
  STORAGE_KEYS: { EMAIL_CAPTURE: 'vv_email_capture' },
}));

import EmailCapture from '../../components/EmailCapture';
import { vvSet } from '../../lib/storage';

describe('EmailCapture — Launch Notification Form', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders email input and submit button', () => {
    render(<EmailCapture />);
    expect(screen.getByPlaceholderText('your@email.com')).toBeTruthy();
    expect(screen.getByRole('button')).toBeTruthy();
  });

  test('shows error on invalid email (no @)', async () => {
    render(<EmailCapture />);
    const input = screen.getByPlaceholderText('your@email.com');
    const form = screen.getByRole('button').closest('form');

    fireEvent.change(input, { target: { value: 'invalidemail' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email/)).toBeTruthy();
    });
  });

  test('shows success state after valid submission', async () => {
    render(<EmailCapture />);
    const input = screen.getByPlaceholderText('your@email.com');
    const form = screen.getByRole('button').closest('form');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(screen.getByText(/Thank you/)).toBeTruthy();
    });
  });

  test('persists email to localStorage on submit', async () => {
    render(<EmailCapture />);
    const input = screen.getByPlaceholderText('your@email.com');
    const form = screen.getByRole('button').closest('form');

    fireEvent.change(input, { target: { value: 'test@example.com' } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(vvSet).toHaveBeenCalledWith('vv_email_capture', expect.objectContaining({
        email: 'test@example.com',
      }));
    });

    // Wait for the simulated network request to finish so we don't update state after unmount
    await waitFor(() => {
      expect(screen.getByText(/Thank you/)).toBeTruthy();
    });
  });

  test('shows no spam disclaimer', () => {
    render(<EmailCapture />);
    expect(screen.getByText(/No spam/)).toBeTruthy();
  });
});

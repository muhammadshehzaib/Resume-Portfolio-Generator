import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsPanel from '@/components/portfolio/SettingsPanel';

vi.mock('@/lib/api', () => ({
  updateSettings: vi.fn(),
  checkSlugAvailability: vi.fn(),
}));

import * as api from '@/lib/api';

describe('SettingsPanel - Slug Validation', () => {
  const mockOnClose = vi.fn();
  const mockOnUpdate = vi.fn();
  const portfolioId = 'test-portfolio-id';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('shows format error for invalid slug (too short)', async () => {
    render(
      <SettingsPanel
        portfolioId={portfolioId}
        slug=""
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const input = screen.getByPlaceholderText('johndoe');
    await userEvent.type(input, 'ab');

    expect(screen.getByText('3-50 chars, lowercase alphanumeric and hyphens only')).toBeInTheDocument();
    expect(screen.getByText('✗')).toBeInTheDocument();
  });

  it('shows checking state while debouncing', async () => {
    vi.mocked(api.checkSlugAvailability).mockResolvedValue({ available: true });

    render(
      <SettingsPanel
        portfolioId={portfolioId}
        slug=""
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const input = screen.getByPlaceholderText('johndoe');
    await userEvent.type(input, 'valid-slug');

    // Should show "Checking..." immediately after typing (before 400ms debounce)
    expect(screen.getByText('Checking...')).toBeInTheDocument();

    // Advance timers to trigger the API call
    vi.advanceTimersByTime(400);
    await waitFor(() => {
      expect(api.checkSlugAvailability).toHaveBeenCalledWith('valid-slug', portfolioId);
    });
  });

  it('shows Available when slug is free', async () => {
    vi.mocked(api.checkSlugAvailability).mockResolvedValue({ available: true });

    render(
      <SettingsPanel
        portfolioId={portfolioId}
        slug=""
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const input = screen.getByPlaceholderText('johndoe');
    await userEvent.type(input, 'my-awesome-slug');

    vi.advanceTimersByTime(400);

    await waitFor(() => {
      expect(screen.getByText('Available!')).toBeInTheDocument();
      expect(screen.getByText('✓')).toBeInTheDocument();
    });
  });

  it('shows Already taken when slug is taken', async () => {
    vi.mocked(api.checkSlugAvailability).mockResolvedValue({ available: false });

    render(
      <SettingsPanel
        portfolioId={portfolioId}
        slug=""
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const input = screen.getByPlaceholderText('johndoe');
    await userEvent.type(input, 'taken-slug');

    vi.advanceTimersByTime(400);

    await waitFor(() => {
      expect(screen.getByText('Already taken')).toBeInTheDocument();
      expect(screen.getByText('✗')).toBeInTheDocument();
    });
  });

  it('disables Save button when slug is taken', async () => {
    vi.mocked(api.checkSlugAvailability).mockResolvedValue({ available: false });

    render(
      <SettingsPanel
        portfolioId={portfolioId}
        slug=""
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const input = screen.getByPlaceholderText('johndoe');
    const saveButton = screen.getByRole('button', { name: /Save Settings/i });

    await userEvent.type(input, 'taken-slug');
    vi.advanceTimersByTime(400);

    await waitFor(() => {
      expect(saveButton).toBeDisabled();
    });
  });

  it('enables Save button when slug is available', async () => {
    vi.mocked(api.checkSlugAvailability).mockResolvedValue({ available: true });

    render(
      <SettingsPanel
        portfolioId={portfolioId}
        slug=""
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    const input = screen.getByPlaceholderText('johndoe');
    const saveButton = screen.getByRole('button', { name: /Save Settings/i });

    await userEvent.type(input, 'available-slug');
    vi.advanceTimersByTime(400);

    await waitFor(() => {
      expect(saveButton).not.toBeDisabled();
    });
  });

  it('shows default hint when slug is blank', () => {
    render(
      <SettingsPanel
        portfolioId={portfolioId}
        slug=""
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    expect(screen.getByText('Leave blank to use portfolio ID')).toBeInTheDocument();
  });

  it('allows user to keep their own existing slug', async () => {
    vi.mocked(api.checkSlugAvailability).mockResolvedValue({ available: true });

    render(
      <SettingsPanel
        portfolioId={portfolioId}
        slug="my-existing-slug"
        onClose={mockOnClose}
        onUpdate={mockOnUpdate}
      />
    );

    vi.advanceTimersByTime(400);

    await waitFor(() => {
      expect(api.checkSlugAvailability).toHaveBeenCalledWith('my-existing-slug', portfolioId);
      expect(screen.getByText('Available!')).toBeInTheDocument();
    });
  });
});

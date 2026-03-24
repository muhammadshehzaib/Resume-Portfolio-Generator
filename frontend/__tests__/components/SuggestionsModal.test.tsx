import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SuggestionsModal from '@/components/portfolio/SuggestionsModal';
import * as api from '@/lib/api';
import { vi } from 'vitest';

vi.mock('@/lib/api');

describe('SuggestionsModal', () => {
  const mockPortfolioId = 'test-portfolio-123';
  const mockOnClose = vi.fn();

  const mockSuggestionResult = {
    overall_score: 75,
    issues: ['Experience descriptions lack specific metrics', 'Missing contact information'],
    improvements: ['Add specific numbers to achievements', 'Include technical keywords for ATS'],
    positives: ['Good diverse skill set', 'Clear project descriptions'],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Loading and auto-analysis', () => {
    it('should show loading state on mount', async () => {
      const mockGetSuggestions = vi.fn(() =>
        new Promise((resolve) => setTimeout(() => resolve(mockSuggestionResult), 100))
      );
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      expect(screen.getByText('Analyzing your portfolio...')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /AI Portfolio Analysis/i })).toBeInTheDocument();
    });

    it('should auto-analyze on mount', async () => {
      const mockGetSuggestions = vi.fn().mockResolvedValue(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(mockGetSuggestions).toHaveBeenCalledWith(mockPortfolioId);
      });
    });

    it('should only analyze once on mount', async () => {
      const mockGetSuggestions = vi.fn().mockResolvedValue(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      const { rerender } = render(
        <SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />
      );

      await waitFor(() => {
        expect(mockGetSuggestions).toHaveBeenCalledTimes(1);
      });

      // Rerender shouldn't trigger another analysis
      rerender(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      expect(mockGetSuggestions).toHaveBeenCalledTimes(1);
    });
  });

  describe('Successful results display', () => {
    it('should display overall score correctly', async () => {
      const mockGetSuggestions = vi.fn().mockResolvedValue(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('75/100')).toBeInTheDocument();
        expect(screen.getByText('Overall Quality Score')).toBeInTheDocument();
      });
    });

    it('should display issues section when present', async () => {
      const mockGetSuggestions = vi.fn().mockResolvedValue(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Critical Issues to Fix')).toBeInTheDocument();
        expect(
          screen.getByText('Experience descriptions lack specific metrics')
        ).toBeInTheDocument();
        expect(screen.getByText('Missing contact information')).toBeInTheDocument();
      });
    });

    it('should not display issues section when empty', async () => {
      const resultWithoutIssues = { ...mockSuggestionResult, issues: [] };
      const mockGetSuggestions = vi.fn().mockResolvedValue(resultWithoutIssues);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.queryByText('Critical Issues to Fix')).not.toBeInTheDocument();
      });
    });

    it('should display improvements section when present', async () => {
      const mockGetSuggestions = vi.fn().mockResolvedValue(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Suggestions for Improvement')).toBeInTheDocument();
        expect(screen.getByText('Add specific numbers to achievements')).toBeInTheDocument();
        expect(
          screen.getByText('Include technical keywords for ATS')
        ).toBeInTheDocument();
      });
    });

    it('should not display improvements section when empty', async () => {
      const resultWithoutImprovements = { ...mockSuggestionResult, improvements: [] };
      const mockGetSuggestions = vi.fn().mockResolvedValue(resultWithoutImprovements);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.queryByText('Suggestions for Improvement')).not.toBeInTheDocument();
      });
    });

    it('should display positives section when present', async () => {
      const mockGetSuggestions = vi.fn().mockResolvedValue(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText("What's Working Well")).toBeInTheDocument();
        expect(screen.getByText('Good diverse skill set')).toBeInTheDocument();
        expect(screen.getByText('Clear project descriptions')).toBeInTheDocument();
      });
    });

    it('should not display positives section when empty', async () => {
      const resultWithoutPositives = { ...mockSuggestionResult, positives: [] };
      const mockGetSuggestions = vi.fn().mockResolvedValue(resultWithoutPositives);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.queryByText("What's Working Well")).not.toBeInTheDocument();
      });
    });

    it('should display pro tip section', async () => {
      const mockGetSuggestions = vi.fn().mockResolvedValue(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('💡 Pro Tip:')).toBeInTheDocument();
        expect(
          screen.getByText(
            /Start by fixing the critical issues, then work through the suggestions/i
          )
        ).toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it('should display error message on failure', async () => {
      const mockGetSuggestions = vi
        .fn()
        .mockRejectedValue(new Error('Analysis failed'));
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Analysis failed')).toBeInTheDocument();
      });
    });

    it('should display error message from API response', async () => {
      const mockGetSuggestions = vi
        .fn()
        .mockRejectedValue(new Error('Portfolio not found'));
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Portfolio not found')).toBeInTheDocument();
      });
    });

    it('should display Try Again button on error', async () => {
      const mockGetSuggestions = vi
        .fn()
        .mockRejectedValue(new Error('Analysis failed'));
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
      });
    });

    it('should retry analysis when Try Again is clicked', async () => {
      const mockGetSuggestions = vi
        .fn()
        .mockRejectedValueOnce(new Error('Analysis failed'))
        .mockResolvedValueOnce(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('Analysis failed')).toBeInTheDocument();
      });

      const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
      await userEvent.click(tryAgainButton);

      await waitFor(() => {
        expect(screen.getByText('75/100')).toBeInTheDocument();
      });

      expect(mockGetSuggestions).toHaveBeenCalledTimes(2);
    });
  });

  describe('Button interactions', () => {
    it('should display "Analyze Again" button when results are present', async () => {
      const mockGetSuggestions = vi.fn().mockResolvedValue(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Analyze Again/i })).toBeInTheDocument();
      });
    });

    it('should call analyze again when Analyze Again button is clicked', async () => {
      const mockGetSuggestions = vi.fn().mockResolvedValue(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(mockGetSuggestions).toHaveBeenCalledTimes(1);
      });

      const analyzeAgainButton = screen.getByRole('button', { name: /Analyze Again/i });
      await userEvent.click(analyzeAgainButton);

      await waitFor(() => {
        expect(mockGetSuggestions).toHaveBeenCalledTimes(2);
      });
    });

    it('should display "Close" button when no results', async () => {
      const mockGetSuggestions = vi.fn(() =>
        new Promise((resolve) => setTimeout(() => resolve(mockSuggestionResult), 100))
      );
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      const closeButtons = screen.getAllByRole('button', { name: /Close|Done/i });
      expect(closeButtons.length).toBeGreaterThan(0);
    });

    it('should display "Done" button when results are present', async () => {
      const mockGetSuggestions = vi.fn().mockResolvedValue(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        const doneButton = screen.getByRole('button', { name: /Done/i });
        expect(doneButton).toBeInTheDocument();
      });
    });

    it('should call onClose when Done button is clicked', async () => {
      const mockGetSuggestions = vi.fn().mockResolvedValue(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('75/100')).toBeInTheDocument();
      });

      const doneButton = screen.getByRole('button', { name: /Done/i });
      await userEvent.click(doneButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when X button is clicked', async () => {
      const mockGetSuggestions = vi.fn().mockResolvedValue(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('75/100')).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /✕/i });
      await userEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Edge cases', () => {
    it('should display "Analyze Again" button as disabled during loading', async () => {
      const mockGetSuggestions = vi.fn(() =>
        new Promise((resolve) => setTimeout(() => resolve(mockSuggestionResult), 200))
      );
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('75/100')).toBeInTheDocument();
      });

      const analyzeAgainButton = screen.getByRole('button', {
        name: /Analyze Again/i,
      }) as HTMLButtonElement;
      await userEvent.click(analyzeAgainButton);

      // Button should be disabled during the second analysis
      await waitFor(() => {
        expect(analyzeAgainButton).toBeDisabled();
      });
    });

    it('should handle result with only issues', async () => {
      const resultOnlyIssues = {
        overall_score: 35,
        issues: ['Missing experience', 'No education listed'],
        improvements: [],
        positives: [],
      };
      const mockGetSuggestions = vi.fn().mockResolvedValue(resultOnlyIssues);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('35/100')).toBeInTheDocument();
        expect(screen.getByText('Critical Issues to Fix')).toBeInTheDocument();
        expect(screen.queryByText('Suggestions for Improvement')).not.toBeInTheDocument();
        expect(screen.queryByText("What's Working Well")).not.toBeInTheDocument();
      });
    });

    it('should handle result with only improvements', async () => {
      const resultOnlyImprovements = {
        overall_score: 70,
        issues: [],
        improvements: ['Add keywords', 'Format dates'],
        positives: [],
      };
      const mockGetSuggestions = vi.fn().mockResolvedValue(resultOnlyImprovements);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('70/100')).toBeInTheDocument();
        expect(screen.queryByText('Critical Issues to Fix')).not.toBeInTheDocument();
        expect(screen.getByText('Suggestions for Improvement')).toBeInTheDocument();
        expect(screen.queryByText("What's Working Well")).not.toBeInTheDocument();
      });
    });

    it('should handle result with only positives', async () => {
      const resultOnlyPositives = {
        overall_score: 90,
        issues: [],
        improvements: [],
        positives: ['Great structure', 'Strong skills'],
      };
      const mockGetSuggestions = vi.fn().mockResolvedValue(resultOnlyPositives);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('90/100')).toBeInTheDocument();
        expect(screen.queryByText('Critical Issues to Fix')).not.toBeInTheDocument();
        expect(screen.queryByText('Suggestions for Improvement')).not.toBeInTheDocument();
        expect(screen.getByText("What's Working Well")).toBeInTheDocument();
      });
    });

    it('should handle result with all empty sections', async () => {
      const resultAllEmpty = {
        overall_score: 85,
        issues: [],
        improvements: [],
        positives: [],
      };
      const mockGetSuggestions = vi.fn().mockResolvedValue(resultAllEmpty);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('85/100')).toBeInTheDocument();
        expect(screen.getByText('💡 Pro Tip:')).toBeInTheDocument();
        expect(screen.queryByText('Critical Issues to Fix')).not.toBeInTheDocument();
        expect(screen.queryByText('Suggestions for Improvement')).not.toBeInTheDocument();
        expect(screen.queryByText("What's Working Well")).not.toBeInTheDocument();
      });
    });

    it('should handle scores at boundaries (1 and 100)', async () => {
      const resultMinScore = {
        overall_score: 1,
        issues: ['Very poor portfolio'],
        improvements: ['Everything needs work'],
        positives: [],
      };
      const mockGetSuggestions = vi.fn().mockResolvedValue(resultMinScore);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      await waitFor(() => {
        expect(screen.getByText('1/100')).toBeInTheDocument();
      });

      // Test max score
      vi.clearAllMocks();
      const resultMaxScore = {
        overall_score: 100,
        issues: [],
        improvements: [],
        positives: ['Perfect portfolio'],
      };
      const mockGetSuggestionsMax = vi.fn().mockResolvedValue(resultMaxScore);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestionsMax);

      const { rerender } = render(
        <SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />
      );

      await waitFor(() => {
        expect(screen.getByText('100/100')).toBeInTheDocument();
      });
    });
  });

  describe('Modal structure and accessibility', () => {
    it('should have correct modal title', async () => {
      const mockGetSuggestions = vi.fn().mockResolvedValue(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      expect(screen.getByRole('heading', { name: /AI Portfolio Analysis/i })).toBeInTheDocument();
    });

    it('should have descriptive subtitle', async () => {
      const mockGetSuggestions = vi.fn().mockResolvedValue(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      render(<SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />);

      expect(
        screen.getByText(/Get AI-powered suggestions to improve your portfolio/i)
      ).toBeInTheDocument();
    });

    it('should display modal with proper overlay', () => {
      const mockGetSuggestions = vi.fn().mockResolvedValue(mockSuggestionResult);
      vi.mocked(api.getPortfolioSuggestions).mockImplementation(mockGetSuggestions);

      const { container } = render(
        <SuggestionsModal portfolioId={mockPortfolioId} onClose={mockOnClose} />
      );

      const overlay = container.querySelector('.fixed.inset-0.bg-black.bg-opacity-50');
      expect(overlay).toBeInTheDocument();
    });
  });
});

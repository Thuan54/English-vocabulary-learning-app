import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Review } from '../../pages/Review';
import { VocabularyProvider } from '../../contexts/VocabularyContext';
import { fetchDueCards, submitReview } from '../../api/review.api';

// Mock external dependencies
jest.mock('../api/review.api');
jest.mock('canvas-confetti', () => jest.fn());
jest.mock('framer-motion', () => ({
  motion: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockFetchDueCards = fetchDueCards as jest.MockedFunction<typeof fetchDueCards>;
const mockSubmitReview = submitReview as jest.MockedFunction<typeof submitReview>;

const mockWords = [
  {
    id: '1',
    word: 'Test Word',
    meaning: 'Test Meaning',
    pronunciation: '/test/',
    examples: ['Example 1'],
    synonyms: ['Synonym 1'],
    topics: ['Topic 1'],
    category: 'learned' as const,
    addedDate: new Date(),
    lastReviewed: new Date(),
    reviewCount: 1,
    nextReview: new Date(Date.now() - 86400000), // Due yesterday
  },
];

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <VocabularyProvider>
      {component}
    </VocabularyProvider>
  );
};

describe('Review Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    mockFetchDueCards.mockResolvedValue([]);
    renderWithProvider(<Review />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders no cards message when no due cards', async () => {
    mockFetchDueCards.mockResolvedValue([]);
    renderWithProvider(<Review />);
    await waitFor(() => {
      expect(screen.getByText('No cards to review')).toBeInTheDocument();
    });
  });

  it('renders flashcard when due cards are available', async () => {
    mockFetchDueCards.mockResolvedValue([mockWords[0]]);
    renderWithProvider(<Review />);
    await waitFor(() => {
      expect(screen.getByText('Test Word')).toBeInTheDocument();
      expect(screen.getByText('/test/')).toBeInTheDocument();
    });
  });

  it('flips card when clicked', async () => {
    mockFetchDueCards.mockResolvedValue([mockWords[0]]);
    renderWithProvider(<Review />);
    await waitFor(() => {
      expect(screen.getByText('Test Word')).toBeInTheDocument();
    });

    const card = screen.getByText('Test Word').closest('div');
    fireEvent.click(card!);

    await waitFor(() => {
      expect(screen.getByText('Test Meaning')).toBeInTheDocument();
    });
  });

  it('shows review buttons after flipping', async () => {
    mockFetchDueCards.mockResolvedValue([mockWords[0]]);
    renderWithProvider(<Review />);
    await waitFor(() => {
      expect(screen.getByText('Test Word')).toBeInTheDocument();
    });

    const card = screen.getByText('Test Word').closest('div');
    fireEvent.click(card!);

    await waitFor(() => {
      expect(screen.getByText('Forget')).toBeInTheDocument();
      expect(screen.getByText('Hard')).toBeInTheDocument();
      expect(screen.getByText('Medium')).toBeInTheDocument();
      expect(screen.getByText('Easy')).toBeInTheDocument();
    });
  });

  it('handles review submission', async () => {
    mockFetchDueCards.mockResolvedValue([mockWords[0]]);
    mockSubmitReview.mockResolvedValue(undefined);
    renderWithProvider(<Review />);
    await waitFor(() => {
      expect(screen.getByText('Test Word')).toBeInTheDocument();
    });

    const card = screen.getByText('Test Word').closest('div');
    fireEvent.click(card!);

    await waitFor(() => {
      expect(screen.getByText('Easy')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Easy'));

    await waitFor(() => {
      expect(mockSubmitReview).toHaveBeenCalledWith('1', 'easy');
    });
  });

  it('shows completion screen when all cards reviewed', async () => {
    mockFetchDueCards.mockResolvedValue([mockWords[0]]);
    mockSubmitReview.mockResolvedValue(undefined);
    renderWithProvider(<Review />);
    await waitFor(() => {
      expect(screen.getByText('Test Word')).toBeInTheDocument();
    });

    const card = screen.getByText('Test Word').closest('div');
    fireEvent.click(card!);

    await waitFor(() => {
      expect(screen.getByText('Easy')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Easy'));

    await waitFor(() => {
      expect(screen.getByText('Great Job! 🎉')).toBeInTheDocument();
    });
  });

  it('handles API failure and falls back to local logic', async () => {
    mockFetchDueCards.mockRejectedValue(new Error('API failed'));
    renderWithProvider(<Review />);
    await waitFor(() => {
      // Should fall back to local words
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  it('restarts review session', async () => {
    mockFetchDueCards.mockResolvedValue([mockWords[0]]);
    mockSubmitReview.mockResolvedValue(undefined);
    renderWithProvider(<Review />);
    await waitFor(() => {
      expect(screen.getByText('Test Word')).toBeInTheDocument();
    });

    const card = screen.getByText('Test Word').closest('div');
    fireEvent.click(card!);
    fireEvent.click(screen.getByText('Easy'));

    await waitFor(() => {
      expect(screen.getByText('Great Job! 🎉')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Practice Again'));

    await waitFor(() => {
      expect(screen.getByText('Test Word')).toBeInTheDocument();
    });
  });
});
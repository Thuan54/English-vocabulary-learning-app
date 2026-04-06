import { render, screen, fireEvent } from '@testing-library/react';
import { WordCard, WordCardProps } from '../../components/ui/wordCard';
import '@testing-library/jest-dom';

describe('WordCard', () => {
  const mockProps: WordCardProps = {
    word: 'Ephemeral',
    meaning: 'Lasting for a very short time.',
    example: 'The ephemeral beauty of cherry blossoms.',
    onReview: jest.fn(),
  };

  it('renders word and meaning', () => {
    render(<WordCard {...mockProps} />);
    expect(screen.getByTestId('word')).toHaveTextContent('Ephemeral');
    expect(screen.getByTestId('meaning')).toHaveTextContent('Lasting for a very short time.');
  });

  it('conditionally renders example', () => {
    const { rerender } = render(<WordCard {...mockProps} />);
    expect(screen.getByTestId('example')).toBeInTheDocument();

    rerender(<WordCard {...mockProps} example={undefined} />);
    expect(screen.queryByTestId('example')).not.toBeInTheDocument();
  });

  it('triggers onReview callback when button is clicked', () => {
    render(<WordCard {...mockProps} />);
    fireEvent.click(screen.getByRole('button', { name: /mark reviewed/i }));
    expect(mockProps.onReview).toHaveBeenCalledTimes(1);
  });
});
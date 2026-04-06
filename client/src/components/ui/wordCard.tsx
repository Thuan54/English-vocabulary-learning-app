import React from 'react';

export interface WordCardProps {
  word: string;
  meaning: string;
  example?: string;
  onReview: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({ word, meaning, example, onReview }) => {
  return (
    <article className="word-card">
      <h2 data-testid="word">{word}</h2>
      <p data-testid="meaning">{meaning}</p>
      {example && <p data-testid="example">{example}</p>}
      <button onClick={onReview}>Mark Reviewed</button>
    </article>
  );
};
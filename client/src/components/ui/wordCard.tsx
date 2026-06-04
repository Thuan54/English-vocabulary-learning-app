import React from "react";

export interface WordCardProps {
  word: string;
  meaning: string;
  example?: string;
  onReview: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({
  word,
  meaning,
  example,
  onReview,
}) => {
  return (
    <div
      role="article"
      style={{ border: "1px solid #ddd", padding: "12px", borderRadius: 6 }}
    >
      <h3 data-testid="word" style={{ margin: 0 }}>
        {word}
      </h3>
      <p data-testid="meaning" style={{ margin: "8px 0" }}>
        {meaning}
      </p>
      {example !== undefined && (
        <p
          data-testid="example"
          style={{ color: "#555", fontStyle: "italic" }}
        >
          {example}
        </p>
      )}
      <button onClick={onReview} aria-label="mark reviewed">
        Mark Reviewed
      </button>
    </div>
  );
};

export default WordCard;
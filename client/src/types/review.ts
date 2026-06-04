export type Word = {
  wordId: string;
  word: string;
  meaning: string;
  pronunciation?: string;
  example?: string;
}

export type DueReview = Word & {
  wordReviewId: string;
  nextReview: Date;
};
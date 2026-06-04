import { ObjectId } from 'mongodb';

// Word info for review context
export type WordInReview = {
  wordId: string;
  word: string;
  meaning: string;
  pronunciation?: string;
  example?: string;
}

// Input DTO for creating a review
export type CreateReviewInputDTO = {
  wordId: string;
}

// Output DTO for review creation
export type CreateReviewResponseDTO = WordInReview & {
  wordReviewId: string;
  nextReview: Date;
}

// Input DTO for review feedback
export type ReviewFeedbackDTO = {
  wordReviewId: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'forget';
}

// Word Review MongoDB document (maps to word_review table)
export type WordReviewDocument = {
  _id?: ObjectId;
  reviewId?: ObjectId | null;
  wordId: ObjectId;
  nextReview: Date;
  interval: number;
  ease: number;
  repetition: number;
}

// Review Record MongoDB document (maps to review_records table)
export type ReviewRecordDocument = {
  wordId: ObjectId,
  reviewed_at: Date;
}

// DTO for due reviews
export type DueReviewDTO = WordInReview & {
  wordReviewId: string;
  nextReview: Date;
}
export interface ReviewInputDTO {
  wordId: string;
  nextReview: string; // ISO date string from client
}

export interface ReviewResponseDTO {
  id: string;
  wordId: string;
  nextReview: Date;
  createdAt: Date;
}


export interface CreateReviewDTO {
  cardId: string;
  difficulty: "easy" | "medium" | "hard" | "forget";
}
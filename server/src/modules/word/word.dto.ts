export interface WordInputDTO {
    word: string;
    meaning: string;
    synonyms?: string[];
    topics?: string[];
    category?: string;
    reviewCount?: number;
    nextReview?: Date;
    lastReviewed?: Date;
}

export interface WordResponseDTO {
    id: string;
    word: string;
    meaning: string;
    synonyms: string[];
    topics: string[];
    category?: string;
    reviewCount?: number;
    nextReview?: Date;
    lastReviewed?: Date;
    createdAt: Date;
}
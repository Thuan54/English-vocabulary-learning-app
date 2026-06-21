// Input DTO for creating a word
export interface WordInputDTO {
    word: string;
    meaning: string;
    pronunciation?: string;
    example?: string;
}

// Output DTO for word responses
export interface WordResponseDTO {
    wordId: string;
    word: string;
    meaning: string;
    pronunciation?: string;
    example?: string;
}

// MongoDB document representation
export interface WordMongoDocument {
    _id: any;
    word: string;
    meaning: string;
    pronunciation: string;
    example: string;
}
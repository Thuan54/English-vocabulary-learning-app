export interface WordInputDTO {
    word: string;
    meaning: string;
    synonyms?: string[];
    topics?: string[];
}

export interface WordResponseDTO {
    id: string;
    word: string;
    meaning: string;
    synonyms: string[];
    topics: string[];
    createdAt: Date;
}
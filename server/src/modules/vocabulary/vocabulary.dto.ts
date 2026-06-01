/**
 * DTO for creating a new word
 */
export interface CreateWordDTO {
  word: string;
  meaning: string;
}

/**
 * DTO for word response
 */
export interface WordResponseDTO {
  id: any;
  word: string;
  meaning: string;
  createdAt?: Date;
  search_count?: number;
}

/**
 * DTO for word lookup query
 */
export interface LookupWordQueryDTO {
  q: string;
}

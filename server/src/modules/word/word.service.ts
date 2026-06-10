import { WordRepository } from './word.repo';
import { WordResponseDTO } from './word.dto';
import { validateString } from '../../utils/validation';
import { ReviewRepository } from '../review/review.repo';
import { MlClient } from '../ai/ml.client';

export class WordService {
    constructor(
        private repo: WordRepository, 
        private reviewRepo: ReviewRepository,
        private mlClient?: MlClient
    ) { }

    async createWord(body: unknown): Promise<WordResponseDTO> {
        const requestBody = body as Record<string, unknown>;
        const word = validateString(requestBody.word, 'word');
        const meaning = validateString(requestBody.meaning, 'meaning');

        let embedding: number[] | undefined = undefined;
        if (this.mlClient) {
            try {
                embedding = await this.mlClient.getEmbedding(word);
            } catch (err) {
                console.error(`Failed to fetch embedding for "${word}":`, err);
            }
        }

        const result = await this.repo.insert({
            word,
            meaning,
            embedding
        });

        const wordReview = await this.reviewRepo.createReview(result.wordId)

        return result
    }

    async getWords(): Promise<WordResponseDTO[]> {
        return this.repo.getAll();
    }

    async getWordById(wordId: string): Promise<WordResponseDTO | null> {
        return this.repo.getById(wordId);
    }

    async getWordByText(wordText: string): Promise<WordResponseDTO | null> {
        const word = validateString(wordText, 'q');
        return this.repo.findByWordAndIncrementSearchCount(word);
    }
}
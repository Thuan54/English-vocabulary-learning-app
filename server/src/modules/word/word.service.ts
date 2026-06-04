import { WordRepository } from './word.repo';
import { WordResponseDTO } from './word.dto';
import { validateString } from '../../utils/validation';
import { ReviewRepository } from '../review/review.repo';

export class WordService {
    constructor(private repo: WordRepository, private reviewRepo: ReviewRepository) { }

    async createWord(body: unknown): Promise<WordResponseDTO> {
        const requestBody = body as Record<string, unknown>;
        const word = validateString(requestBody.word, 'word');
        const meaning = validateString(requestBody.meaning, 'meaning');

        const result = await this.repo.insert({
            word,
            meaning
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
}
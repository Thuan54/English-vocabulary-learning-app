import { WordRepository } from './word.repo';
import { WordResponseDTO } from './word.dto';
import { validateString } from '../../utils/validation';
import { ReviewRepository } from '../review/review.repo';
import { AiService } from '../ai/ai.service';

export class WordService {
    private aiService: AiService
    constructor(private repo: WordRepository, private reviewRepo: ReviewRepository, aiService: AiService) { 
        this.aiService = aiService
    }

    async createWord(body: unknown): Promise<WordResponseDTO> {
        const requestBody = body as Record<string, unknown>;
        const word = validateString(requestBody.word, 'word');
        const meaning = validateString(requestBody.meaning, 'meaning');

        const stored = await this.repo.getByWord(word)

        if(stored) return stored
            
        const result = await this.repo.insert({
            word,
            meaning
        });

        const wordReview = await this.reviewRepo.createReview(result.wordId)

        this.aiService.embedding({wordId: result.wordId, word: result.word})

        return result
    }

    async getWords(): Promise<WordResponseDTO[]> {
        return this.repo.getAll();
    }

    async getWordById(wordId: string): Promise<WordResponseDTO | null> {
        return this.repo.getById(wordId);
    }
}
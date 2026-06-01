import { WordRepository } from './word.repo';
import { WordResponseDTO } from './word.dto';
import { validateString } from '../../utils/validation';

export class WordService {
    constructor(private repo: WordRepository) { }

    async createWord(body: any): Promise<WordResponseDTO> {
        const word = validateString(body.word, 'word');
        const meaning = validateString(body.meaning, 'meaning');

        const synonyms = Array.isArray(body.synonyms)
            ? body.synonyms.map((s: any) => validateString(s, 'synonym'))
            : [];
        const topics = Array.isArray(body.topics)
            ? body.topics.map((t: any) => validateString(t, 'topic'))
            : [];

        return this.repo.insert({
            word,
            meaning,
            synonyms,
            topics
        });
    }

    async getWords(): Promise<WordResponseDTO[]> {
        return this.repo.getAll();
    }

    async updateWordReviewData(wordId: string, updates: Partial<{ category: string; reviewCount: number; nextReview: Date; lastReviewed: Date }>): Promise<void> {
        return this.repo.updateReviewData(wordId, updates);
    }
}
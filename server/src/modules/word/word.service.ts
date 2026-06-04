import { WordRepository } from './word.repo';
import { WordInputDTO, WordResponseDTO } from './word.dto';
import { validateString } from '../../utils/validation';

export class WordService {
    constructor(private repo: WordRepository) { }

    async createWord(body: unknown): Promise<WordResponseDTO> {
        const requestBody = body as Record<string, unknown>;
        const word = validateString(requestBody.word, 'word');
        const meaning = validateString(requestBody.meaning, 'meaning');

        return this.repo.insert({
            word,
            meaning
        });
    }

    async getWords(): Promise<WordResponseDTO[]> {
        return this.repo.getAll();
    }

    async getWordById(wordId: string): Promise<WordResponseDTO | null> {
        return this.repo.getById(wordId);
    }
}
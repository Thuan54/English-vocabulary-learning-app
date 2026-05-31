import { Db, Collection } from 'mongodb';
import { WordInputDTO, WordResponseDTO } from './word.dto';

export class WordRepository {
    private collection: Collection;

    constructor(db: Db) {
        this.collection = db.collection('words');
    }

    async insert(dto: WordInputDTO): Promise<WordResponseDTO> {
        const doc = {
            word: dto.word,
            meaning: dto.meaning,
            synonyms: dto.synonyms || [],
            topics: dto.topics || [],
            createdAt: new Date()
        };

        const result = await this.collection.insertOne(doc);

        return {
            id: result.insertedId.toString(),
            ...doc
        };
    }

    async getAll(): Promise<WordResponseDTO[]> {
        const docs = await this.collection.find().toArray();

        return docs.map((d: any) => ({
            id: d._id.toString(),
            word: d.word,
            meaning: d.meaning,
            synonyms: d.synonyms || [],
            topics: d.topics || [],
            createdAt: d.createdAt
        }));
    }
}
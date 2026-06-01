import { Db, ObjectId, Collection } from 'mongodb';
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
            category: dto.category ?? 'want-to-learn',
            reviewCount: dto.reviewCount ?? 0,
            nextReview: dto.nextReview,
            lastReviewed: dto.lastReviewed,
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
            category: d.category || 'want-to-learn',
            reviewCount: d.reviewCount ?? 0,
            nextReview: d.nextReview,
            lastReviewed: d.lastReviewed,
            createdAt: d.createdAt
        }));
    }

    async updateReviewData(wordId: string, updates: Partial<{ category: string; reviewCount: number; nextReview: Date; lastReviewed: Date }>): Promise<void> {
        await this.collection.updateOne({ _id: new ObjectId(wordId) }, { $set: updates });
    }
}
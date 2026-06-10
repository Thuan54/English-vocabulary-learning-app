import { Db, ObjectId, Collection } from 'mongodb';
import { WordInputDTO, WordResponseDTO, WordMongoDocument } from './word.dto';

export class WordRepository {
    private collection: Collection;

    constructor(db: Db) {
        this.collection = db.collection('words');
    }

    async insert(dto: WordInputDTO): Promise<WordResponseDTO> {
        const doc: Omit<WordMongoDocument,"_id"> & { embedding?: number[]; search_count?: number } = {
            word: dto.word,
            meaning: dto.meaning,
            pronunciation: dto.pronunciation?? "",
            example: dto.example?? "",
            embedding: dto.embedding,
            search_count: dto.search_count ?? 0
        };

        const result = await this.collection.insertOne(doc);

        return {
            wordId: result.insertedId.toString(),
            ...doc
        };
    }

    async findByWordAndIncrementSearchCount(wordText: string): Promise<WordResponseDTO | null> {
        const res = await this.collection.findOneAndUpdate(
            { word: wordText.toLowerCase().trim() },
            { $inc: { search_count: 1 } },
            { returnDocument: 'after' }
        );
        
        if (!res) return null;

        const doc = (res && ('value' in res) ? res.value : res) as any;
        if (!doc) return null;

        return {
            wordId: doc._id.toString(),
            word: doc.word,
            meaning: doc.meaning,
            pronunciation: doc.pronunciation,
            example: doc.example,
            embedding: doc.embedding,
            search_count: doc.search_count
        };
    }

    async getAll(): Promise<WordResponseDTO[]> {
        const docs = await this.collection.find<WordMongoDocument>({}).toArray();

        return docs.map((d) => ({
            wordId: d._id.toString(),
            word: d.word,
            meaning: d.meaning,
            pronunciation: d.pronunciation,
            example: d.example,
            embedding: d.embedding,
            search_count: d.search_count
        }));
    }

    async getById(wordId: string): Promise<WordResponseDTO | null> {
        const doc = await this.collection.findOne<WordMongoDocument>({ _id: new ObjectId(wordId) });
        
        if (!doc) return null;

        return {
            wordId: doc._id.toString(),
            word: doc.word,
            meaning: doc.meaning,
            pronunciation: doc.pronunciation,
            example: doc.example,
            embedding: doc.embedding,
            search_count: doc.search_count
        };
    }
}
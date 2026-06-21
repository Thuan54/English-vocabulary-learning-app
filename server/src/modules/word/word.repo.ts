import { Db, ObjectId, Collection } from 'mongodb';
import { WordInputDTO, WordResponseDTO, WordMongoDocument } from './word.dto';
import { Word } from '../ai/ai.service';

export class WordRepository {
    private collection: Collection;

    constructor(db: Db) {
        this.collection = db.collection('words');
    }

    async insert(dto: WordInputDTO): Promise<WordResponseDTO> {
        const doc: Omit<WordMongoDocument,"_id"> = {
            word: dto.word,
            meaning: dto.meaning,
            pronunciation: dto.pronunciation?? "",
            example: dto.example?? ""
        };

        const result = await this.collection.insertOne(doc);

        return {
            wordId: result.insertedId.toString(),
            ...doc
        };
    }

    async getAll(): Promise<WordResponseDTO[]> {
        const docs = await this.collection.find<WordMongoDocument>({}).toArray();

        return docs.map((d) => ({
            wordId: d._id.toString(),
            word: d.word,
            meaning: d.meaning,
            pronunciation: d.pronunciation,
            example: d.example
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
            example: doc.example
        };
    }

    async getByWord(word: string): Promise<Word | null> {
        const doc = await this.collection.findOne({
            word: word
        })
        
        if(!doc) return doc

        return {
            wordId: doc._id.toString(),
            word: doc.word,
            meaning: doc.meaning
        }
    }
}
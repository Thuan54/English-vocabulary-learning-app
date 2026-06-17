import { Collection, Db, ObjectId } from 'mongodb';
import { MlClient } from './ml.client';
import { AppError } from '../../middleware/error';

export interface Word {
  wordId: string;
  word: string;
  meaning: string;
}

export class AiService {
  private wordCollection : Collection
  constructor(private readonly mlClient: MlClient, db: Db) {
    this.wordCollection = db.collection('words')
  }

  /**
   * Giải nghĩa từ vựng bằng AI (Groq/LLaMA qua ml_server).
   */
  async explainWord(word: string): Promise<{ explanation: string }> {
    return this.mlClient.explainWord(word);
  }

  /**
   * Gợi ý các tag/từ liên quan dựa trên embedding similarity.
   * Dùng khi thêm từ mới để tự động đề xuất category phù hợp.
   */
  async suggestTags(topic: string, topK: number = 10): Promise<Word[]> {
    const res = await this.mlClient.suggestTags(topic, topK);
    const words = await this.wordCollection.find({
      _id: {
        $in: res.map((word) => new ObjectId(word.wordId))
      }
    }).toArray()
    if(!words) throw new AppError('No related words found','NOT_FOUND_WORD',404)
    
    return words.map(word => {
      const relatedWord: Word = {
        wordId: word._id.toString(),
        word: word.word,
        meaning: word.meaning,
      }
      return relatedWord
    })
  }

  async embedding(word: {wordId: string, word: string}){
    const res = this.mlClient.embeding(word.word)
    await this.wordCollection.findOneAndUpdate(
    {wordId: new ObjectId(word.wordId)},
    {$set: {embedding: (await res).embedding}})
  }
}
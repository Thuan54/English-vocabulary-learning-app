// Import thẳng hàm groupWords — cần export nó từ LearnedWordsPage.tsx trước
import { groupWords } from '../../pages/LearnedWordsPage';
import { Word } from '../../contexts/VocabularyContext';

// Dữ liệu mẫu để test
const mockWords: Word[] = [
  {
    id: '1', word: 'Ephemeral', meaning: 'Short-lived',
    pronunciation: '', examples: [], reviewCount: 0,
    synonyms: ['fleeting', 'transient'],
    topics: ['Nature', 'Time'],
    category: 'learned', addedDate: new Date(),
  },
  {
    id: '2', word: 'Serendipity', meaning: 'Happy accident',
    pronunciation: '', examples: [], reviewCount: 0,
    synonyms: ['luck', 'chance'],
    topics: ['Life'],
    category: 'learned', addedDate: new Date(),
  },
];

describe('groupWords', () => {

  it('gom nhóm đúng theo topics', () => {
    const result = groupWords(mockWords, 'topics');
    expect(result['Nature']).toHaveLength(1);
    expect(result['Nature'][0].word).toBe('Ephemeral');
    expect(result['Time']).toHaveLength(1);
    expect(result['Life']).toHaveLength(1);
  });

  it('từ có nhiều topics thì xuất hiện ở nhiều nhóm', () => {
    const result = groupWords(mockWords, 'topics');
    expect(result['Nature'][0].word).toBe('Ephemeral');
    expect(result['Time'][0].word).toBe('Ephemeral');
  });

  it('gom nhóm đúng theo synonyms', () => {
    const result = groupWords(mockWords, 'synonyms');
    expect(result['fleeting']).toHaveLength(1);
    expect(result['luck']).toHaveLength(1);
  });

  it('trả về object rỗng khi không có từ nào', () => {
    const result = groupWords([], 'topics');
    expect(result).toEqual({});
  });

});
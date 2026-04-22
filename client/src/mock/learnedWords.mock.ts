export interface LearnedWord {
  id: string;
  word: string;
  meaning: string;
  example?: string;
  synonyms: string[];
  topics: string[];
  lastReviewed: string;
}

// Dữ liệu giả — sau này sẽ thay bằng API call khi backend sẵn sàng
export const MOCK_LEARNED_WORDS: LearnedWord[] = [
  {
    id: '1',
    word: 'Ephemeral',
    meaning: 'Lasting for a very short time; temporary',
    example: 'The beauty of cherry blossoms is ephemeral.',
    synonyms: ['transient', 'fleeting'],
    topics: ['Nature', 'Time'],
    lastReviewed: '2026-04-01',
  },
  {
    id: '2',
    word: 'Serendipity',
    meaning: 'Finding pleasant things by chance',
    example: 'Meeting my best friend was pure serendipity.',
    synonyms: ['chance', 'luck'],
    topics: ['Emotions', 'Life'],
    lastReviewed: '2026-04-05',
  },
  {
    id: '3',
    word: 'Meticulous',
    meaning: 'Showing great attention to detail',
    example: 'She was meticulous in her research.',
    synonyms: ['careful', 'thorough'],
    topics: ['Work', 'Skills'],
    lastReviewed: '2026-04-10',
  },
  {
    id: '4',
    word: 'Innovative',
    meaning: 'Featuring new methods; advanced and original',
    example: 'His innovative approach changed the industry.',
    synonyms: ['creative', 'original'],
    topics: ['Work', 'Creativity'],
    lastReviewed: '2026-04-12',
  },
];

// Hàm gom nhóm — dùng lại cho cả topic lẫn synonym
export function groupWords(
  words: LearnedWord[],
  by: 'topics' | 'synonyms'
): Record<string, LearnedWord[]> {
  const groups: Record<string, LearnedWord[]> = {};
  for (const word of words) {
    for (const key of word[by]) {
      if (!groups[key]) groups[key] = [];
      groups[key].push(word);
    }
  }
  return groups;
}
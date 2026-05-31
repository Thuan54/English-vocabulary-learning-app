import { useState } from 'react';
import { useVocabulary, Word } from '../contexts/VocabularyContext';

export function groupWords(words: Word[], by: 'topics' | 'synonyms'): Record<string, Word[]> {
  const groups: Record<string, Word[]> = {};
  for (const word of words) {
    for (const key of word[by]) {
      if (!groups[key]) groups[key] = [];
      groups[key].push(word);
    }
  }
  return groups;
}

type GroupMode = 'topics' | 'synonyms';

export function LearnedWordsPage() {
  const { words } = useVocabulary();
  const [groupMode, setGroupMode] = useState<GroupMode>('topics');
  const [searchQuery, setSearchQuery] = useState('');    // ← tên group đang tìm
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const learnedWords = words.filter(w => w.category === 'learned');
  const groups = groupWords(learnedWords, groupMode);

  // Tìm group khớp với searchQuery — chỉ hiện khi đã gõ gì đó
  const matchedGroup: Word[] | null =
    searchQuery.trim() === ''
      ? null
      : groups[
          // tìm key khớp case-insensitive
          Object.keys(groups).find(
            k => k.toLowerCase() === searchQuery.trim().toLowerCase()
          ) ?? ''
        ] ?? null;

  // Gợi ý các group name khi đang gõ (partial match)
  const suggestions =
    searchQuery.trim() === ''
      ? []
      : Object.keys(groups).filter(k =>
          k.toLowerCase().includes(searchQuery.trim().toLowerCase())
        );

  return (
    <div className="p-8 max-w-2xl mx-auto">

      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-800">Learned Words</h1>
      <p className="text-gray-600 mt-2 mb-8">
        {learnedWords.length} words · {Object.keys(groups).length} groups
      </p>

      {/* Toggle Group Mode */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => { setGroupMode('topics'); setSearchQuery(''); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            groupMode === 'topics'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          By Topic
        </button>
        <button
          onClick={() => { setGroupMode('synonyms'); setSearchQuery(''); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            groupMode === 'synonyms'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          By Synonym
        </button>
      </div>

      {/* Search Box */}
      <div className="relative mb-8">
        <input
          type="text"
          value={searchQuery}
          onChange={e => {
            setSearchQuery(e.target.value);
            setExpandedId(null); // reset card mở khi đổi tìm kiếm
          }}
          placeholder={
            groupMode === 'topics'
              ? 'Search by topic (e.g. Nature, Time...)'
              : 'Search by synonym (e.g. fleeting, chance...)'
          }
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 bg-white"
        />

        {/* Gợi ý khi đang gõ — chưa chọn chính xác */}
        {suggestions.length > 0 && !matchedGroup && (
          <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 shadow-lg z-10 overflow-hidden">
            {suggestions.map(s => (
              <button
                key={s}
                onClick={() => setSearchQuery(s)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
              >
                {s}
                <span className="text-gray-400 text-xs ml-2">
                  {groups[s].length} words
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Trạng thái ban đầu — chưa gõ gì */}
      {searchQuery.trim() === '' && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-sm">
            Type a {groupMode === 'topics' ? 'topic' : 'synonym'} name to see its words
          </p>
          <p className="text-xs mt-2 text-gray-300">
            Available: {Object.keys(groups).join(', ')}
          </p>
        </div>
      )}

      {/* Không tìm thấy group */}
      {searchQuery.trim() !== '' && !matchedGroup && suggestions.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-sm">No group found for "{searchQuery}"</p>
        </div>
      )}

      {/* Kết quả — hiện danh sách từ của group tìm được */}
      {matchedGroup && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-purple-600 mb-3">
            {searchQuery.trim()} · {matchedGroup.length} words
          </h2>

          <div className="flex flex-col gap-2">
            {matchedGroup.map(word => (
              <div
                key={word.id}
                onClick={() => setExpandedId(expandedId === word.id ? null : word.id)}
                className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-purple-300 hover:shadow-sm transition-all"
              >
                {/* Dòng chính */}
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold text-gray-800">{word.word}</span>
                    <span className="text-gray-400 mx-2">—</span>
                    <span className="text-gray-500 text-sm">{word.meaning}</span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {expandedId === word.id ? '▲' : '▼'}
                  </span>
                </div>

                {/* Chi tiết khi mở rộng */}
                {expandedId === word.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                    {word.examples[0] && (
                      <p className="text-sm italic text-gray-400">
                        "{word.examples[0]}"
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {word.topics.map(t => (
                        <span key={t} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                      {word.synonyms.map(s => (
                        <span key={s} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                          ~{s}
                        </span>
                      ))}
                    </div>
                    {word.lastReviewed && (
                      <p className="text-xs text-gray-400">
                        Last reviewed: {new Date(word.lastReviewed).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
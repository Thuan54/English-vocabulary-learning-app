import { useState } from 'react';
import {
  MOCK_LEARNED_WORDS,
  groupWords,
  LearnedWord,
} from '../mock/learnedWords.mock';

type GroupMode = 'topics' | 'synonyms';

export default function LearnedWordsPage() {
  const [groupMode, setGroupMode] = useState<GroupMode>('topics');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Gom nhóm dựa theo mode hiện tại
  const groups = groupWords(MOCK_LEARNED_WORDS, groupMode);

  return (
    <div className="max-w-3xl mx-auto p-8">

      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-1">
        Learned Words
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        {MOCK_LEARNED_WORDS.length} words you have mastered
      </p>

      {/* Toggle */}
      <div className="flex gap-2 mb-8">
        <button
          onClick={() => setGroupMode('topics')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            groupMode === 'topics'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Group by Topic
        </button>
        <button
          onClick={() => setGroupMode('synonyms')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
            groupMode === 'synonyms'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          Group by Synonym
        </button>
      </div>

      {/* Danh sách nhóm */}
      <div className="flex flex-col gap-8">
        {Object.entries(groups).map(([groupKey, groupWords]) => (
          <div key={groupKey}>

            {/* Tên nhóm */}
            <h2 className="text-xs font-semibold uppercase tracking-widest text-purple-600 mb-3">
              {groupKey} · {groupWords.length} words
            </h2>

            {/* Các từ trong nhóm */}
            <div className="flex flex-col gap-2">
              {groupWords.map((word: LearnedWord) => (
                <div
                  key={word.id}
                  onClick={() => setExpandedId(
                    expandedId === word.id ? null : word.id
                  )}
                  className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-purple-300 hover:shadow-sm transition-all"
                >
                  {/* Dòng chính luôn hiển thị */}
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-bold text-gray-800">
                        {word.word}
                      </span>
                      <span className="text-gray-400 mx-2">—</span>
                      <span className="text-gray-500 text-sm">
                        {word.meaning}
                      </span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      {expandedId === word.id ? '▲' : '▼'}
                    </span>
                  </div>

                  {/* Chi tiết — chỉ hiện khi bấm vào */}
                  {expandedId === word.id && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                      {word.example && (
                        <p className="text-sm italic text-gray-400">
                          "{word.example}"
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-2">
                        {word.topics.map(t => (
                          <span key={t}
                            className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            {t}
                          </span>
                        ))}
                        {word.synonyms.map(s => (
                          <span key={s}
                            className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
                            ~{s}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400">
                        Last reviewed: {word.lastReviewed}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
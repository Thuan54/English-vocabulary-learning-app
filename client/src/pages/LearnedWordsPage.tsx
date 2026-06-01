import { useState } from 'react';
import { useVocabulary } from '../contexts/VocabularyContext';
import { Word } from "../types/word";
import GroupToggle from '../components/learned/GroupToggle';
import SearchBox from '../components/learned/SearchBox';
import WordItem from '../components/learned/WordItem';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const learnedWords = words.filter(w => w.category === 'learned');
  const groups = groupWords(learnedWords, groupMode);

  const matchedGroup: Word[] | null =
    searchQuery.trim() === ''
      ? null
      : groups[
          Object.keys(groups).find(
            k => k.toLowerCase() === searchQuery.trim().toLowerCase()
          ) ?? ''
        ] ?? null;

  const suggestions =
    searchQuery.trim() === ''
      ? []
      : Object.keys(groups).filter(k => k.toLowerCase().includes(searchQuery.trim().toLowerCase()));

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800">Learned Words</h1>
      <p className="text-gray-600 mt-2 mb-8">{learnedWords.length} words · {Object.keys(groups).length} groups</p>

      <GroupToggle mode={groupMode} onSetMode={(m) => { setGroupMode(m); setSearchQuery(''); }} />

      <SearchBox value={searchQuery} onChange={(v) => { setSearchQuery(v); setExpandedId(null); }} placeholder={groupMode === 'topics' ? 'Search by topic (e.g. Nature, Time...)' : 'Search by synonym (e.g. fleeting, chance...)'} suggestions={suggestions} onSelectSuggestion={(s) => setSearchQuery(s)} />

      {searchQuery.trim() === '' && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-sm">Type a {groupMode === 'topics' ? 'topic' : 'synonym'} name to see its words</p>
          <p className="text-xs mt-2 text-gray-300">Available: {Object.keys(groups).join(', ')}</p>
        </div>
      )}

      {searchQuery.trim() !== '' && !matchedGroup && suggestions.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-sm">No group found for "{searchQuery}"</p>
        </div>
      )}

      {matchedGroup && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-purple-600 mb-3">{searchQuery.trim()} · {matchedGroup.length} words</h2>
          <div className="flex flex-col gap-2">
            {matchedGroup.map(word => (
              <WordItem key={word.id} word={word} expanded={expandedId === word.id} onToggle={() => setExpandedId(expandedId === word.id ? null : word.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
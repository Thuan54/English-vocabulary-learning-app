import { useState, useEffect } from 'react';
import { Word } from "../types/review";
import GroupToggle from '../components/learned/GroupToggle';
import SearchBox from '../components/learned/SearchBox';
import WordItem from '../components/learned/WordItem';
import { fetchRelatedWords } from '../api/ai.api';

type GroupMode = 'topics' | 'synonyms';

export function LearnedWordsPage() {

  const [groups, setGroups] = useState< Word[]>([])
  const [groupMode, setGroupMode] = useState<GroupMode>('topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function fetchGroups() {
    const data : Word[] = await fetchRelatedWords(searchQuery, groupMode);
      
    setGroups(data)
  }

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setGroups([]);
      return;
    }
    fetchGroups();
  }, [searchQuery, groupMode]);

  const suggestions =
    searchQuery.trim() === ''
      ? []
      : Object.keys(groups).filter(k => k.toLowerCase().includes(searchQuery.trim().toLowerCase()));

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800">Learned Words</h1>
      <p className="text-gray-600 mt-2 mb-8">{groups.length} words</p>

      <GroupToggle mode={groupMode} onSetMode={(m) => { setGroupMode(m); setSearchQuery(''); }} />

      <SearchBox setValue={setSearchQuery} placeholder={groupMode === 'topics' ? 'Search by topic (e.g. Nature, Time...)' : 'Search by synonym (e.g. fleeting, chance...)'} />

      {searchQuery.trim() === '' && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-sm">Type a {groupMode === 'topics' ? 'topic' : 'synonym'} name to see its words</p>
        </div>
      )}

      {searchQuery.trim() !== '' && !groups.length && suggestions.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">😕</p>
          <p className="text-sm">No group found for "{searchQuery}"</p>
        </div>
      )}

      {groups.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-purple-600 mb-3">{searchQuery.trim()} · {groups.length} words</h2>
          <div className="flex flex-col gap-2">
            {groups.map(word => (
              <WordItem key={word.wordId} word={word} expanded={expandedId === word.wordId} onToggle={() => setExpandedId(expandedId === word.wordId ? null : word.wordId)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
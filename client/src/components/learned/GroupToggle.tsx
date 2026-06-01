
type Props = {
  mode: 'topics' | 'synonyms';
  onSetMode: (m: 'topics' | 'synonyms') => void;
};

export function GroupToggle({ mode, onSetMode }: Props) {
  return (
    <div className="flex gap-2 mb-6">
      <button onClick={() => onSetMode('topics')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'topics' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>By Topic</button>
      <button onClick={() => onSetMode('synonyms')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${mode === 'synonyms' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>By Synonym</button>
    </div>
  );
}

export default GroupToggle;

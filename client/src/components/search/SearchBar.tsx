import { Search, BookOpen, Sparkles } from 'lucide-react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onDictionarySearch: () => void;
  onAskAi: () => void;
};

export function SearchBar({ value, onChange, onKeyPress, onDictionarySearch, onAskAi }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 border border-gray-200">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            onKeyPress={onKeyPress} 
            placeholder="Search for a word (try: tenacious, benevolent, ubiquitous, eloquent)" 
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg" 
          />
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onDictionarySearch} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
          >
            <BookOpen className="w-5 h-5" />
            <span className="hidden sm:inline">Dictionary</span>
          </button>
          <button 
            onClick={onAskAi} 
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow"
          >
            <Sparkles className="w-5 h-5" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
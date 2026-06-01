import { Search } from 'lucide-react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSearch: () => void;
};

export function SearchBar({ value, onChange, onKeyPress, onSearch }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 border border-gray-200">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input type="text" value={value} onChange={(e) => onChange(e.target.value)} onKeyPress={onKeyPress} placeholder="Search for a word (try: tenacious, benevolent, ubiquitous, eloquent)" className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg" />
        </div>
        <button onClick={onSearch} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow">Search</button>
      </div>
    </div>
  );
}

export default SearchBar;

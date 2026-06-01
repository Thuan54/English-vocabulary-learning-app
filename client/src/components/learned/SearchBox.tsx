
type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  suggestions: string[];
  onSelectSuggestion: (s: string) => void;
};

export function SearchBox({ value, onChange, placeholder, suggestions, onSelectSuggestion }: Props) {
  return (
    <div className="relative mb-8">
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-400 bg-white" />

      {suggestions.length > 0 && value.trim() !== '' && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-1 shadow-lg z-10 overflow-hidden">
          {suggestions.map(s => (
            <button key={s} onClick={() => onSelectSuggestion(s)} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700">
              {s}
              <span className="text-gray-400 text-xs ml-2">{/* count placeholder */}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBox;

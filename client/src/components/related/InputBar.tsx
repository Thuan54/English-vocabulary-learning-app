import { Send, Sparkles } from 'lucide-react';

type Props = {
  inputValue: string;
  onChange: (v: string) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSend: () => void;
};

export function InputBar({ inputValue, onChange, onKeyPress, onSend }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-200">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Sparkles className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type a topic (e.g. character, kindness, communication...)"
            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
          />
        </div>
        <button onClick={onSend} className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg transition-shadow inline-flex items-center gap-2">
          <Send className="w-5 h-5" />
          Search
        </button>
      </div>
    </div>
  );
}

export default InputBar;

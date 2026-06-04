import { Word } from '../../types/review'

type Props = {
  word: Word;
  expanded: boolean;
  onToggle: () => void;
};

export function WordItem({ word, expanded, onToggle }: Props) {
  return (
    <div onClick={onToggle} className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-purple-300 hover:shadow-sm transition-all">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-bold text-gray-800">{word.word}</span>
          <span className="text-gray-400 mx-2">—</span>
          <span className="text-gray-500 text-sm">{word.meaning}</span>
        </div>
        <span className="text-gray-400 text-xs">{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          {word.example && <p className="text-sm italic text-gray-400">"{word.example}"</p>}
        </div>
      )}
    </div>
  );
}

export default WordItem;

import { BookmarkPlus, Check } from 'lucide-react';
import { RelatedWordData } from '../../types/related';

type Props = {
  w: RelatedWordData;
  isSaved: boolean;
  onAdd: (wd: RelatedWordData) => void;
};

export function WordCard({ w, isSaved, onAdd }: Props) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-800">{w.word}</span>
            <span className="text-sm text-gray-500">{w.pronunciation}</span>
          </div>
          <p className="text-gray-600 mt-1">{w.meaning}</p>
          <p className="text-gray-500 text-sm mt-2 italic">&ldquo;{w.example}&rdquo;</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {w.synonyms.map((syn: string, i: number) => (
              <span key={i} className="px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{syn}</span>
            ))}
          </div>
        </div>
        <button
          onClick={() => onAdd(w)}
          disabled={isSaved}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
            isSaved ? 'bg-green-100 text-green-700' : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
          }`}
        >
          {isSaved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <BookmarkPlus className="w-4 h-4" />
              Add
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default WordCard;
